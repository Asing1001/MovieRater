import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Ratings from './Ratings';
import Movie from '@/models/movie';

export default function MovieCard({ movie, children }: { movie: Movie; children?: React.ReactNode }) {
  const href = `/movie/${movie.movieBaseId}`;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        mb: 1.5,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        bgcolor: 'background.paper',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.16)' },
      }}
    >
      {/* Poster */}
      <Box
        component="img"
        src={movie.posterUrl}
        alt={movie.chineseTitle}
        loading="lazy"
        sx={{
          flexShrink: 0,
          width: { xs: 90, sm: 120 },
          height: { xs: 130, sm: 175 },
          objectFit: 'cover',
          display: 'block',
          bgcolor: 'grey.100',
        }}
      />

      {/* Content */}
      <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Stretched link: title text is the anchor, ::after overlays the whole card */}
        <Box
          component={Link}
          href={href}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
            },
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ lineHeight: 1.3, mb: 0.25 }}
            noWrap
          >
            {movie.chineseTitle}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.75 }}
            noWrap
          >
            {movie.englishTitle}
          </Typography>
        </Box>

        {/* Meta row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
          {movie.releaseDate && <span>{movie.releaseDate}</span>}
          {movie.releaseDate && movie.types?.length > 0 && <span>·</span>}
          {movie.types?.length > 0 && <span>{movie.types.slice(0, 3).join('/')}</span>}
          {movie.runTime && <><span>·</span><span>{movie.runTime}分</span></>}
        </Box>

        <Ratings movie={movie} sx={{ mb: 0.5 }} />

        {children && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 'auto',
              pt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            {children}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
