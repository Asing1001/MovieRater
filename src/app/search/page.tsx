import { searchMovies, briefSummary } from '@/lib/movies';
import { classifyArticle } from '@/lib/utils';
import MovieCard from '@/components/MovieCard';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '搜尋 - Movie Rater' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  if (!query) {
    return <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>請輸入電影名稱進行搜尋。</Typography>;
  }

  const movies = searchMovies(query).map(classifyArticle);

  if (!movies.length) {
    return <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>找不到「{query}」相關的電影。</Typography>;
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        「{query}」的搜尋結果，共 {movies.length} 部
      </Typography>
      {movies.map((movie) => (
        <MovieCard key={movie.movieBaseId?.toString()} movie={movie}>
          {briefSummary(movie.summary)}
        </MovieCard>
      ))}
    </>
  );
}
