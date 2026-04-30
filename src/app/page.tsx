import { getRecentMovies, briefSummary } from '@/lib/movies';
import { classifyArticle, sortMovies, SortKey } from '@/lib/utils';
import MovieCard from '@/components/MovieCard';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '現正上映 - Movie Rater' };

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams;
  const movies = getRecentMovies().map(classifyArticle);
  const sorted = sortMovies(movies, (sort as SortKey) || 'releaseDate');

  if (!sorted.length) {
    return <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>資料載入中，請稍後重新整理…</Typography>;
  }

  return (
    <>
      {sorted.map((movie) => (
        <MovieCard key={movie.movieBaseId?.toString()} movie={movie}>
          {briefSummary(movie.summary)}
        </MovieCard>
      ))}
    </>
  );
}
