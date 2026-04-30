import cacheManager from '../data/cacheManager';
import Movie from '../models/movie';
import { ObjectId } from 'mongodb';

export function getRecentMovies(): Movie[] {
  return cacheManager.get(cacheManager.RECENT_MOVIES) ?? [];
}

export function getUpcomingMovies(): Movie[] {
  const all: Movie[] = cacheManager.get(cacheManager.All_MOVIES) ?? [];
  const today = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  return all.filter(({ releaseDate }) => {
    const d = new Date(releaseDate).getTime();
    return d > today && d < today + ninetyDaysMs;
  });
}

export function getMovieById(id: string): Movie | undefined {
  const all: Movie[] = cacheManager.get(cacheManager.All_MOVIES) ?? [];
  if (ObjectId.isValid(id)) {
    return all.find((m) => m.movieBaseId?.toString() === id);
  }
  return all.find((m) => m.yahooId?.toString() === id);
}

export function briefSummary(summary?: string): string {
  if (!summary) return '';
  return summary.length > 70 ? summary.slice(0, 70) + '...' : summary;
}

export function getAllMovieNames(): { value: string; text: string }[] {
  return cacheManager.get(cacheManager.All_MOVIES_NAMES) ?? [];
}

export function searchMovies(query: string): Movie[] {
  const all: Movie[] = cacheManager.get(cacheManager.All_MOVIES) ?? [];
  const q = query.toLowerCase();
  return all
    .filter(
      ({ chineseTitle, englishTitle }) =>
        chineseTitle?.toLowerCase().includes(q) || englishTitle?.toLowerCase().includes(q)
    )
    .slice(0, 10);
}
