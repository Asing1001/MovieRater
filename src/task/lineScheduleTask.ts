import moment from 'moment';
import { Mongo } from '../data/db';
import { crawlLineSchedules } from '../crawler/lineScheduleCrawler';
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

  const allSchedules = (
    await promiseMap(
      playingMovies,
      (movie) => crawlLineSchedules(movie.lineMovieDbId, dates),
      { concurrency: 5, delay: 200 }
    )
  ).flat();

  const col = Mongo.db.collection('schedules');
  await col.deleteMany({});
  if (allSchedules.length) {
    await col.insertMany(allSchedules);
    await col.createIndex({ lineMovieDbId: 1, date: 1 });
    await col.createIndex({ theaterName: 1, date: 1 });
  }

  console.log(`updateLineSchedules: stored ${allSchedules.length} schedule entries`);
}
