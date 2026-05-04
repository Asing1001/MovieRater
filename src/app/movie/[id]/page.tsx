import { cache } from 'react';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { Mongo } from '@/data/db';
import { COLLECTIONS } from '@/data/collections';
import Movie from '@/models/movie';
import Schedule from '@/models/schedule';
import { getArticlesByMovieBaseId } from '@/lib/articles';
import { classifyArticle, serialize } from '@/lib/utils';
import { cleanMovieSummary } from '@/lib/text';
import { buildMetadata, compactText, jsonLd, movieJsonLd, moviePath, movieTitle, posterImage } from '@/lib/seo';
import Ratings from '@/components/Ratings';
import PttArticles from '@/components/PttArticles';
import Schedules from '@/components/Schedules';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import type { Metadata } from 'next';

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

function lineTrailerUrl(movie: Movie) {
  return movie.lineTrailerHash ? `https://today.line.me/tw/v2/article/${movie.lineTrailerHash}` : null;
}

const fetchMovie = cache(async (id: string): Promise<Movie | null> => {
  await Mongo.openDbConnection();
  const query = ObjectId.isValid(id)
    ? { movieBaseId: id }
    : { yahooId: Number(id) };
  const raw = await Mongo.db.collection<Movie>(COLLECTIONS.mergedDatas).findOne(query);
  if (!raw) return null;

  // Enrich from movieBases if mergedDatas has not caught up yet.
  if (raw.movieBaseId && (!raw.lineMovieDbId || !raw.imdbRating || !raw.imdbID || !raw.lineTrailerHash)) {
    const movieBase = await Mongo.db
      .collection<{ _id: string; lineMovieDbId?: string; imdbRating?: string; imdbID?: string; lineTrailerHash?: string }>(COLLECTIONS.movieBases)
      .findOne({ _id: raw.movieBaseId } as any, { projection: { lineMovieDbId: 1, imdbRating: 1, imdbID: 1, lineTrailerHash: 1 } });
    if (movieBase?.lineMovieDbId && !raw.lineMovieDbId) raw.lineMovieDbId = movieBase.lineMovieDbId;
    if (movieBase?.imdbRating && !raw.imdbRating) raw.imdbRating = movieBase.imdbRating;
    if (movieBase?.imdbID && !raw.imdbID) raw.imdbID = movieBase.imdbID;
    if (movieBase?.lineTrailerHash && !raw.lineTrailerHash) raw.lineTrailerHash = movieBase.lineTrailerHash;
  }

  return serialize(raw);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await fetchMovie(id);
  if (!movie) return { title: 'Movie Rater' };
  const summary = cleanMovieSummary(movie.summary);
  const title = `${movieTitle(movie) || movie.chineseTitle || '電影'} | Movie Rater`;
  return buildMetadata({
    title,
    description: compactText(summary),
    path: moviePath(movie, id),
    image: posterImage(movie.posterUrl),
    type: 'article',
  });
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const raw = await fetchMovie(id);
  if (!raw) notFound();

  const [articles, scheduleRows] = await Promise.all([
    getArticlesByMovieBaseId(raw.movieBaseId ?? ''),
    raw.lineMovieDbId
      ? Mongo.db
          .collection<Schedule>(COLLECTIONS.schedules)
          .find({ lineMovieDbId: raw.lineMovieDbId })
          .toArray()
          .then(serialize)
      : Promise.resolve([]),
  ]);

  const movie = classifyArticle({ ...raw, summary: cleanMovieSummary(raw.summary), relatedArticles: articles });
  const schema = movieJsonLd(movie, id);
  const posterUrl = movie.posterUrl?.replace('/w280', '/w644') ?? '';
  const trailerUrl = lineTrailerUrl(movie);
  const pttArticleCount = [
    movie.goodRateArticles,
    movie.normalRateArticles,
    movie.badRateArticles,
    movie.otherArticles,
  ].reduce((sum, group) => sum + (group?.length ?? 0), 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

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

      <Box
        component="nav"
        aria-label="電影頁面區塊"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2,
        }}
      >
        {trailerUrl && (
          <Button component="a" href="#trailer" variant="outlined" size="small">
            預告
          </Button>
        )}
        <Button component="a" href="#schedules" variant="outlined" size="small">
          放映時刻 ({scheduleRows.length})
        </Button>
        <Button component="a" href="#ptt" variant="outlined" size="small">
          PTT 討論 ({pttArticleCount})
        </Button>
      </Box>

      {trailerUrl && (
        <Paper
          component="section"
          id="trailer"
          variant="outlined"
          sx={{ scrollMarginTop: 88, p: 2, mb: 3 }}
        >
          <Typography variant="h6" component="h2" fontWeight={800} sx={{ mb: 0.75 }}>
            預告
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            前往 LINE TODAY 觀看電影預告。
          </Typography>
          <Button component="a" href={trailerUrl} target="_blank" rel="noopener" variant="contained">
            開啟預告
          </Button>
        </Paper>
      )}

      <Box component="section" id="schedules" sx={{ scrollMarginTop: 88, mb: 3 }}>
        <Typography variant="h6" component="h2" fontWeight={800} sx={{ mb: 1 }}>
          放映時刻
        </Typography>
        {scheduleRows.length > 0 ? (
          <Schedules schedules={scheduleRows} showTitle={false} />
        ) : (
          <Typography color="text.secondary">目前無場次資料</Typography>
        )}
      </Box>

      <Box component="section" id="ptt" sx={{ scrollMarginTop: 88 }}>
        <Typography variant="h6" component="h2" fontWeight={800} sx={{ mb: 1 }}>
          PTT 討論
        </Typography>
        <PttArticles
          good={movie.goodRateArticles ?? []}
          normal={movie.normalRateArticles ?? []}
          bad={movie.badRateArticles ?? []}
          other={movie.otherArticles ?? []}
        />
      </Box>
    </>
  );
}
