import Box from '@mui/material/Box';
import Movie from '@/models/movie';
import { SxProps } from '@mui/material/styles';

interface BadgeProps { color: string; textColor?: string; label: string; value: string; href?: string }

function Badge({ color, textColor = '#fff', label, value, href }: BadgeProps) {
  const content = (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        minHeight: 24,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 42,
          height: 20,
          background: color,
          color: textColor,
          fontSize: '0.65rem',
          fontWeight: 800,
          px: 0.75,
          borderRadius: '4px',
          lineHeight: 1,
        }}
      >
        {label}
      </Box>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: 20,
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1,
          color: 'text.primary',
        }}
      >
        {value}
      </Box>
    </Box>
  );

  if (href) {
    // position:relative + zIndex:2 so this link stays clickable on top of any
    // parent stretched-link overlay (e.g. inside MovieCard).
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        style={{ display: 'inline-flex', textDecoration: 'none', color: 'inherit', position: 'relative', zIndex: 2 }}
      >
        {content}
      </a>
    );
  }
  return content;
}

export default function Ratings({ movie, sx, showPtt = true }: { movie: Movie; sx?: SxProps; showPtt?: boolean }) {
  const g = movie.goodRateArticles?.length ?? movie.pttGoodCount ?? 0;
  const n = movie.normalRateArticles?.length ?? movie.pttNormalCount ?? 0;
  const b = movie.badRateArticles?.length ?? movie.pttBadCount ?? 0;
  const pttValue = g + n + b > 0 ? `好${g} 普${n} 負${b}` : 'N/A';

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 1.25, rowGap: 0.5, ...sx }}>
      <Badge
        color="#f5c518"
        textColor="#000"
        label="IMDb"
        value={movie.imdbRating || 'N/A'}
        href={movie.imdbID ? `https://www.imdb.com/title/${movie.imdbID}` : undefined}
      />
      <Badge
        color="#06c755"
        label="LINE"
        value={movie.lineRating || 'N/A'}
        href={movie.lineUrlHash ? `https://today.line.me/tw/v2/movie/${movie.lineUrlHash}/2` : undefined}
      />
      {showPtt && <Badge color="#1a1a1a" label="PTT" value={pttValue} />}
    </Box>
  );
}
