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
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>載入中，請稍後...</Typography>;
  }

  return (
    <>
      {sorted.map((movie) => (
        <MovieCard key={movie.movieBaseId?.toString()} movie={movie}>
          {movie.summary && (
            <p className="resultSummary" style={{ fontSize: '0.85rem', marginTop: 4 }}>
              {briefSummary(movie.summary)}
            </p>
          )}
        </MovieCard>
      ))}
    </>
  );
}
