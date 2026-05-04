import { getComingSoonMovies } from '@/crawler/lineCrawler';
import { COLLECTIONS } from '@/data/collections';
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

  const collection = Mongo.db.collection<ComingSoonMovie>(COLLECTIONS.comingSoonMovies);

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
