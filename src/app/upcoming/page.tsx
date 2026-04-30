import { getUpcomingMovies, briefSummary } from '@/lib/movies';
import { classifyArticle, sortMovies, SortKey } from '@/lib/utils';
import MovieCard from '@/components/MovieCard';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '即將上映 - Movie Rater' };

export default async function UpcomingPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams;
  const movies = getUpcomingMovies().map(classifyArticle);
  const sorted = sortMovies(movies, (sort as SortKey) || 'releaseDate');

  if (!sorted.length) {
    return <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>目前沒有即將上映的電影資料。</Typography>;
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
