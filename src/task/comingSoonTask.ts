import { getComingSoonMovies } from '@/crawler/lineCrawler';
import { Mongo } from '@/data/db';
import {
  ComingSoonMovie,
  getComingSoonStartMonths,
  mapLineComingSoonMovie,
} from '@/lib/comingSoonMovies';

export async function updateComingSoonMovies(months = getComingSoonStartMonths()): Promise<ComingSoonMovie[]> {
  await Mongo.openDbConnection();

  const byLineMovieDbId = new Map<string, ComingSoonMovie>();
  for (const month of months) {
    const response = await getComingSoonMovies(month);
    for (const item of response.items ?? []) {
      const movie = mapLineComingSoonMovie(item);
      if (movie.lineMovieDbId) {
        byLineMovieDbId.set(movie.lineMovieDbId, movie);
      }
    }
  }

  const collection = Mongo.db.collection<ComingSoonMovie>('comingSoonMovies');
  await collection.createIndex({ lineMovieDbId: 1 }, { unique: true });
  await collection.createIndex({ releaseDate: 1, likeCount: -1 });

  const movies = [...byLineMovieDbId.values()];
  if (!movies.length) {
    return [];
  }

  await collection.bulkWrite(
    movies.map((movie) => ({
      updateOne: {
        filter: { lineMovieDbId: movie.lineMovieDbId },
        update: { $set: movie },
        upsert: true,
      },
    })),
    { ordered: false }
  );

  return movies;
}
