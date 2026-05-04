import { getRecentMovies, briefSummary } from '@/lib/movies';
import { classifyArticle, sortMovies, SortKey } from '@/lib/utils';
import { buildMetadata, itemListJsonLd, jsonLd, moviePath, movieTitle } from '@/lib/seo';
import MovieCard from '@/components/MovieCard';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: '現正上映 - Movie Rater',
  description: '整理台灣現正上映電影，快速比較 IMDb、LINE 與 PTT 評價，並查看電影時刻表。',
  path: '/',
});

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort } = await searchParams;
  const movies = getRecentMovies().map(classifyArticle);
  const sorted = sortMovies(movies, (sort as SortKey) || 'releaseDate');

  if (!sorted.length) {
    return <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>資料載入中，請稍後重新整理…</Typography>;
  }

  const schema = itemListJsonLd(
    sorted.map((movie) => ({
      name: movieTitle(movie),
      url: moviePath(movie),
      image: movie.posterUrl,
    })),
    '台灣現正上映電影',
    'Movie'
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      {sorted.map((movie) => (
        <MovieCard key={movie.movieBaseId?.toString()} movie={movie}>
          {briefSummary(movie.summary)}
        </MovieCard>
      ))}
    </>
  );
}
