import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/movies';
import { getSchedulesByMovieName } from '@/lib/theaters';
import { classifyArticle, getMovieSchema } from '@/lib/utils';
import Ratings from '@/components/Ratings';
import PttArticles from '@/components/PttArticles';
import Schedules from '@/components/Schedules';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import type { Metadata } from 'next';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = getMovieById(id);
  if (!movie) return { title: 'Movie Rater' };
  return {
    title: `${movie.chineseTitle} ${movie.englishTitle} | Movie Rater`,
    description: movie.summary?.slice(0, 160),
    openGraph: { images: movie.posterUrl ? [movie.posterUrl] : [] },
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const raw = getMovieById(id);
  if (!raw) notFound();

  const movie = classifyArticle(raw);
  const schedules = getSchedulesByMovieName(movie.chineseTitle ?? '');
  const schema = getMovieSchema(movie);
  const posterUrl = movie.posterUrl?.replace('/w280', '/w644') ?? '';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {posterUrl && (
            <img src={posterUrl} alt={movie.chineseTitle} style={{ width: 160, objectFit: 'cover', flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5" fontWeight={700}>{movie.chineseTitle}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{movie.englishTitle}</Typography>
            <Ratings movie={movie} />
            <Box sx={{ mt: 1, fontSize: '0.9rem', '& > div': { mb: 0.5 } }}>
              <div>上映日期：{movie.releaseDate || '未提供'}</div>
              <div>類型：{movie.types?.join('、') || '未提供'}</div>
              <div>片長：{movie.runTime ? `${movie.runTime}分鐘` : '未提供'}</div>
              <div>導演：{movie.directors?.join('、') || '未提供'}</div>
              <div>演員：{movie.actors?.join('、') || '未提供'}</div>
            </Box>
          </Box>
        </Box>
        {movie.summary && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">{movie.summary}</Typography>
          </Box>
        )}
      </Paper>

      {schedules.length > 0 && <Schedules schedules={schedules} />}

      <PttArticles
        good={movie.goodRateArticles ?? []}
        normal={movie.normalRateArticles ?? []}
        bad={movie.badRateArticles ?? []}
        other={movie.otherArticles ?? []}
      />
    </>
  );
}
