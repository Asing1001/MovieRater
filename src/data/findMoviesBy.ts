import Movie from "../models/movie";

export function findMoviesBy(allMovies: Movie[], ids: [string], findBy: "_id" | "yahooId") {
  const idSet = new Set(ids);
  const movies = [];

  for (const movie of allMovies) {
    if (idSet.has(movie[findBy].toString())) {
      movies.push(movie);
      idSet.delete(movie[findBy].toString());
    }

    if (idSet.size === 0) {
      break;
    }
  }

  return movies;

}