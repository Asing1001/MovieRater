import moment from 'moment';
import { Mongo } from '../data/db';
import { crawlLineSchedules, LineTheaterInfo } from '../crawler/lineScheduleCrawler';
import { getPlayingMovies } from '../crawler/lineCrawler';
import { promiseMap } from '../helper/promiseMap';

export async function updateLineSchedules(): Promise<void> {
  // Query yahooMovies directly — mergedDatas (in-memory cache) may not have lineMovieDbId yet
  const inTheaterResponse = await getPlayingMovies();
  const inTheaterLineIds = new Set(inTheaterResponse.items.map((i) => i.id));

  const moviesWithDbId = await Mongo.db
    .collection<{ lineMovieId: string; lineMovieDbId: string }>('yahooMovies')
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

  const scheduleCol = Mongo.db.collection('schedules');
  await scheduleCol.deleteMany({});
  if (allSchedules.length) {
    await scheduleCol.insertMany(allSchedules);
    await scheduleCol.createIndex({ lineMovieDbId: 1, date: 1 });
    await scheduleCol.createIndex({ lineTheaterId: 1, date: 1 });
    await scheduleCol.createIndex({ theaterName: 1, date: 1 });
  }

  // Upsert LINE theaters into theaters collection — keyed by lineTheaterId
  // Only sets lineTheaterId, name, theaterCity, address from LINE; preserves other fields (phone, location)
  const theaterCol = Mongo.db.collection('theaters');
  await Promise.all([...allTheaters.values()].map((t) =>
    theaterCol.updateOne(
      { lineTheaterId: t.lineTheaterId },
      {
        $set: {
          lineTheaterId: t.lineTheaterId,
          name: t.name,
          theaterCity: t.theaterCity,
          address: t.address,
        },
      },
      { upsert: true }
    )
  ));

  console.log(`updateLineSchedules: stored ${allSchedules.length} schedule entries, upserted ${allTheaters.size} theaters`);
}
