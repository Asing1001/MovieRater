import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/movies';
import { getSchedulesByLineMovieDbId } from '@/lib/theaters';
import { classifyArticle, getMovieSchema, serialize } from '@/lib/utils';
import Ratings from '@/components/Ratings';
import PttArticles from '@/components/PttArticles';
import Schedules from '@/components/Schedules';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
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
  const schedules = movie.lineMovieDbId ? getSchedulesByLineMovieDbId(movie.lineMovieDbId) : [];
  const schema = getMovieSchema(movie);
  const posterUrl = movie.posterUrl?.replace('/w280', '/w644') ?? '';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero section */}
      <Paper elevation={0} variant="outlined" sx={{ overflow: 'hidden', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 0, flexDirection: { xs: 'column', sm: 'row' } }}>
          {posterUrl && (
            <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 200 } }}>
              <img
                src={posterUrl}
                alt={movie.chineseTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxHeight: 300 }}
              />
            </Box>
          )}
          <Box sx={{ flex: 1, p: 2.5 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>{movie.chineseTitle}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>{movie.englishTitle}</Typography>
            <Ratings movie={movie} sx={{ my: 1.5 }} />
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: '0.875rem' }}>
              {movie.releaseDate && <><span style={{ color: 'grey' }}>上映日期</span><span>{movie.releaseDate}</span></>}
              {movie.types?.length > 0 && <><span style={{ color: 'grey' }}>類型</span><span>{movie.types.join('、')}</span></>}
              {movie.runTime && <><span style={{ color: 'grey' }}>片長</span><span>{movie.runTime} 分鐘</span></>}
              {movie.directors?.length > 0 && <><span style={{ color: 'grey' }}>導演</span><span>{movie.directors.join('、')}</span></>}
              {movie.actors?.length > 0 && <><span style={{ color: 'grey' }}>演員</span><span>{movie.actors.join('、')}</span></>}
            </Box>
          </Box>
        </Box>
        {movie.summary && (
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {movie.summary}
            </Typography>
          </Box>
        )}
      </Paper>

      {schedules.length > 0 && <Schedules schedules={schedules} />}

      <PttArticles
        good={serialize(movie.goodRateArticles ?? [])}
        normal={serialize(movie.normalRateArticles ?? [])}
        bad={serialize(movie.badRateArticles ?? [])}
        other={serialize(movie.otherArticles ?? [])}
      />
    </>
  );
}
