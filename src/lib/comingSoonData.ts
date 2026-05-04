import { Mongo } from '@/data/db';
import { ComingSoonMovie, getTaipeiDateString } from '@/lib/comingSoonMovies';

export async function getComingSoonCalendarMovies(now = new Date()): Promise<ComingSoonMovie[]> {
  await Mongo.openDbConnection();
  const today = getTaipeiDateString(now);
  const movies = await Mongo.db
    .collection<ComingSoonMovie>('comingSoonMovies')
    .find({ releaseDate: { $gte: today }, broadcastStatus: 'COMING_SOON' })
    .sort({ releaseDate: 1, likeCount: -1, chineseTitle: 1 })
    .toArray();
  return JSON.parse(JSON.stringify(movies));
}
