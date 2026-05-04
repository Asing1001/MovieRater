import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import type { Metadata } from 'next';
import { buildMetadata, itemListJsonLd, jsonLd } from '@/lib/seo';
import {
  ComingSoonMovie,
  groupComingSoonMoviesByMonth,
} from '@/lib/comingSoonMovies';
import { getComingSoonCalendarMovies } from '@/lib/comingSoonData';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = buildMetadata({
  title: '即將上映 - Movie Rater',
  description: '依台灣上映日期整理即將上映電影、預告與片型，快速找到值得留意的新片。',
  path: '/upcoming',
});

function lineMovieUrl(movie: ComingSoonMovie) {
  return movie.lineUrlHash ? `https://today.line.me/tw/v2/movie/${movie.lineUrlHash}` : null;
}

function lineTrailerUrl(movie: ComingSoonMovie) {
  return movie.lineTrailerHash ? `https://today.line.me/tw/v2/article/${movie.lineTrailerHash}` : null;
}

function UpcomingMovieCard({ movie }: { movie: ComingSoonMovie }) {
  const movieUrl = lineMovieUrl(movie);
  const trailerUrl = lineTrailerUrl(movie);
  const title = movieUrl ? (
    <Box
      component="a"
      href={movieUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
    >
      {movie.chineseTitle}
    </Box>
  ) : (
    movie.chineseTitle
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '76px minmax(0, 1fr)', sm: '96px minmax(0, 1fr)' },
        gap: { xs: 1.25, sm: 1.75 },
        p: { xs: 1, sm: 1.5 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      {movie.posterUrl ? (
        <Box
          component="img"
          src={movie.posterUrl}
          alt={movie.chineseTitle}
          loading="lazy"
          sx={{
            width: '100%',
            aspectRatio: '2 / 3',
            objectFit: 'cover',
            borderRadius: 0.75,
            bgcolor: 'grey.100',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '2 / 3',
            display: 'grid',
            placeItems: 'center',
            borderRadius: 0.75,
            bgcolor: 'grey.100',
            color: 'text.disabled',
          }}
        >
          <LocalMoviesIcon />
        </Box>
      )}

      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            {title}
          </Typography>
          {movie.englishTitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
              {movie.englishTitle}
            </Typography>
          )}
        </Box>

        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.5}>
          {movie.certificate && movie.certificate !== 'UNKNOWN' && <Chip size="small" label={movie.certificate} />}
          {movie.runTime && <Chip size="small" label={`${movie.runTime} 分`} />}
          {movie.types.slice(0, 3).map((type) => (
            <Chip key={type} size="small" label={type} />
          ))}
        </Stack>

        {movie.summary && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {movie.summary}
          </Typography>
        )}

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {movie.likeCount > 0 && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: 'text.secondary', fontSize: '0.8rem' }}>
              <FavoriteBorderIcon sx={{ fontSize: 16 }} />
              <span>{movie.likeCount}</span>
            </Box>
          )}
          {trailerUrl && (
            <Button
              component="a"
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              startIcon={<PlayCircleOutlineIcon />}
              sx={{ ml: movie.likeCount > 0 ? 0.5 : 0 }}
            >
              預告
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default async function UpcomingPage() {
  const movies = await getComingSoonCalendarMovies();
  const groups = groupComingSoonMoviesByMonth(movies);

  if (!groups.length) {
    return (
      <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
        目前沒有即將上映的電影資料。
      </Typography>
    );
  }

  const schema = itemListJsonLd(
    movies.map((movie) => ({
      name: [movie.chineseTitle, movie.englishTitle].filter(Boolean).join(' '),
      url: lineMovieUrl(movie) ?? '/upcoming',
      image: movie.posterUrl ?? undefined,
    })),
    '台灣即將上映電影',
    'Movie'
  );

  return (
    <Box sx={{ py: 1 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" fontWeight={800} sx={{ mb: 0.5 }}>
          即將上映
        </Typography>
        <Typography variant="body2" color="text.secondary">
          依台灣上映日期整理近期新片，先看預告與片型，再決定要留意哪一部。
        </Typography>
      </Box>

      <Stack spacing={3}>
        {groups.map((month) => (
          <Box key={month.month}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <CalendarMonthIcon color="primary" fontSize="small" />
              <Typography variant="h6" component="h2" fontWeight={800}>
                {month.displayMonth}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {month.dates.map((date) => (
                <Box
                  key={date.releaseDate}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '52px minmax(0, 1fr)', sm: '72px minmax(0, 1fr)' },
                    gap: { xs: 1, sm: 1.5 },
                    alignItems: 'start',
                  }}
                >
                  <Box
                    sx={{
                      position: 'sticky',
                      top: { xs: 64, sm: 72 },
                      pt: 0.5,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                      {date.displayReleaseDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {date.releaseWeekday}
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    {date.movies.map((movie) => (
                      <UpcomingMovieCard key={movie.lineMovieDbId} movie={movie} />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
