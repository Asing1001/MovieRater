import { NextResponse } from 'next/server';
import cacheManager from '@/data/cacheManager';
import Movie from '@/models/movie';

export async function GET() {
  const byDbId: Record<string, Movie> = cacheManager.get(cacheManager.MOVIES_BY_LINE_MOVIE_DB_ID) ?? {};
  const allMovies: Movie[] = cacheManager.get(cacheManager.All_MOVIES) ?? [];
  const sample = Object.values(byDbId).slice(0, 3).map((m) => ({
    chineseTitle: m.chineseTitle,
    lineMovieDbId: m.lineMovieDbId,
    posterUrl: m.posterUrl,
  }));
  const withPoster = allMovies.filter((m) => m.posterUrl).length;
  return NextResponse.json({
    byDbIdSize: Object.keys(byDbId).length,
    allMoviesTotal: allMovies.length,
    allMoviesWithPoster: withPoster,
    sample,
  });
}
