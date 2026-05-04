import { searchMovies, briefSummary } from '@/lib/movies';
import { classifyArticle } from '@/lib/utils';
import { buildMetadata, itemListJsonLd, jsonLd, moviePath, movieTitle } from '@/lib/seo';
import MovieCard from '@/components/MovieCard';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();
  return buildMetadata({
    title: query ? `搜尋「${query}」- Movie Rater` : '搜尋 - Movie Rater',
    description: query ? `搜尋 Movie Rater 收錄的「${query}」相關電影與評價。` : '搜尋 Movie Rater 收錄的台灣上映電影、評價與場次。',
    path: query ? `/search?q=${encodeURIComponent(query)}` : '/search',
    noindex: true,
  });
}

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

  const schema = itemListJsonLd(
    movies.map((movie) => ({
      name: movieTitle(movie),
      url: moviePath(movie),
      image: movie.posterUrl,
    })),
    `「${query}」搜尋結果`,
    'Movie'
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
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
