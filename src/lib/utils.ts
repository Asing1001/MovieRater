import Movie from '../models/movie';

export function classifyArticle(movie: Movie): Movie {
  if (!movie?.relatedArticles) return movie;
  const m = { ...movie, goodRateArticles: [], normalRateArticles: [], badRateArticles: [], otherArticles: [] };
  for (const article of movie.relatedArticles) {
    const t = article.title ?? '';
    if (t.includes('好雷') || t.includes('好無雷')) m.goodRateArticles.push(article);
    else if (t.includes('普雷')) m.normalRateArticles.push(article);
    else if (t.includes('負雷')) m.badRateArticles.push(article);
    else m.otherArticles.push(article);
  }
  return m;
}

export type SortKey = 'imdb' | 'line' | 'ptt' | 'releaseDate';

export function sortMovies(movies: Movie[], sortKey: SortKey = 'releaseDate'): Movie[] {
  return [...movies].sort((a, b) => {
    switch (sortKey) {
      case 'imdb':
        return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
      case 'line':
        return (parseFloat(b.lineRating) || 0) - (parseFloat(a.lineRating) || 0);
      case 'ptt': {
        const score = (m: Movie) => (m.goodRateArticles?.length ?? 0) - (m.badRateArticles?.length ?? 0);
        return score(b) - score(a);
      }
      case 'releaseDate':
      default:
        return new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime();
    }
  });
}

export function getDistanceInKM(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const R = 6371;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function getMovieSchema(movie: Movie) {
  const good = movie.goodRateArticles?.length ?? 0;
  const bad = movie.badRateArticles?.length ?? 0;
  const normal = movie.normalRateArticles?.length ?? 0;
  const total = good + bad + normal || 1;
  const clamp = (v: number) => Math.min(5, Math.max(0, v));
  const pttRating = clamp((good * 10 + normal * 7 - bad * 2) / total / 2 || 3.5);
  const imdbRating = clamp(parseFloat(movie.imdbRating) / 2 || 3.5);
  const lineRating = clamp(parseFloat(movie.lineRating) / 2 || 3.5);
  return {
    '@context': 'http://schema.org',
    '@type': 'Movie',
    name: `${movie.chineseTitle} ${movie.englishTitle}`,
    image: movie.posterUrl,
    url: `https://www.mvrater.com/movie/${movie.movieBaseId}`,
    datePublished: movie.releaseDate,
    actor: { '@type': 'Person', name: movie.actors?.join(',') },
    director: { '@type': 'Person', name: movie.directors?.join(',') },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ((imdbRating + lineRating + pttRating) / 3).toFixed(1),
      ratingCount: total + 2,
    },
  };
}
