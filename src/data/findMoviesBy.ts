import Movie from '../models/movie';

export function findMoviesBy(allMovies: Movie[], ids: [string], findBy: 'movieBaseId' | 'yahooId') {
  const idSet = new Set(ids);
  const movies = [];

  for (const movie of allMovies) {
    const targetId = movie[findBy];
    if (!targetId) {
      continue;
    }

    if (idSet.has(targetId.toString())) {
      movies.push(movie);
      idSet.delete(targetId.toString());
    }

    if (idSet.size === 0) {
      break;
    }
  }

  return movies;
}
