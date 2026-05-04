import moment from 'moment';
import { Mongo } from '../data/db';
import { COLLECTIONS } from '../data/collections';
import { crawlLineSchedules, LineTheaterInfo } from '../crawler/lineScheduleCrawler';
import { getPlayingMovies } from '../crawler/lineCrawler';
import { promiseMap } from '../helper/promiseMap';

export async function updateLineSchedules(): Promise<void> {
  // Query movieBases directly; mergedDatas may not have the latest LINE ids yet.
  const inTheaterResponse = await getPlayingMovies();
  const inTheaterLineIds = new Set(inTheaterResponse.items.map((i) => i.id));

  const moviesWithDbId = await Mongo.db
    .collection<{ lineMovieId: string; lineMovieDbId: string }>(COLLECTIONS.movieBases)
    .find({ lineMovieDbId: { $exists: true, $ne: null } })
    .project({ lineMovieId: 1, lineMovieDbId: 1, _id: 0 })
    .toArray();

  const playingMovies = moviesWithDbId.filter((m) => inTheaterLineIds.has(m.lineMovieId));

  if (!playingMovies.length) {
    console.log('updateLineSchedules: no playing movies with lineMovieDbId, skipping');
    return;
  }

  console.log(`updateLineSchedules: crawling schedules for ${playingMovies.length} movies`);

  const dates = Array.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('YYYYMMDD')
  );

  const results = await promiseMap(
    playingMovies,
    (movie) => crawlLineSchedules(movie.lineMovieDbId, dates),
    { concurrency: 5, delay: 200 }
  );

  const allSchedules = results.flatMap((r) => r.schedules);

  // Collect unique theaters seen across all movies
  const allTheaters = new Map<string, LineTheaterInfo>();
  for (const { theaters } of results) {
    for (const t of theaters) {
      if (!allTheaters.has(t.lineTheaterId)) allTheaters.set(t.lineTheaterId, t);
    }
  }

  const scheduleCol = Mongo.db.collection(COLLECTIONS.schedules);
  await scheduleCol.deleteMany({});
  if (allSchedules.length) {
    await scheduleCol.insertMany(allSchedules);
  }

  // Upsert LINE theaters into theaters collection. Prefer the stable LINE id,
  // but claim older seeded same-name records that do not have a LINE id yet so
  // /theater/[name] does not resolve to a duplicate record with no schedules.
  const theaterCol = Mongo.db.collection(COLLECTIONS.theaters);
  await Promise.all([...allTheaters.values()].map(async (t) => {
    const existing =
      await theaterCol.findOne({ lineTheaterId: t.lineTheaterId }) ??
      await theaterCol.findOne({
        name: t.name,
        $or: [
          { lineTheaterId: { $exists: false } },
          { lineTheaterId: null },
          { lineTheaterId: '' },
        ],
      });

    return theaterCol.updateOne(
      existing?._id ? { _id: existing._id } : { lineTheaterId: t.lineTheaterId },
      {
        $set: {
          lineTheaterId: t.lineTheaterId,
          name: t.name,
          theaterCity: t.theaterCity,
          address: t.address,
        },
      },
      { upsert: true }
    );
  }));

  console.log(`updateLineSchedules: stored ${allSchedules.length} schedule entries, upserted ${allTheaters.size} theaters`);
}
