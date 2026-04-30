import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Ratings from './Ratings';
import Movie from '@/models/movie';

export default function MovieCard({ movie, children }: { movie: Movie; children?: React.ReactNode }) {
  const href = `/movie/${movie.movieBaseId}`;
  return (
    <Paper elevation={2} sx={{ mb: 1, display: 'flex', flexDirection: 'row' }}>
      <Link href={href} style={{ flexShrink: 0 }}>
        <img
          className="poster"
          src={movie.posterUrl}
          alt={movie.chineseTitle}
          loading="lazy"
          style={{ display: 'block' }}
        />
      </Link>
      <Box sx={{ flex: 1, p: 1 }}>
        <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
          <Typography variant="subtitle1" fontWeight={700} className="card-title">
            {movie.chineseTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {movie.englishTitle}
          </Typography>
        </Link>

        <Box sx={{ mt: 0.5, fontSize: '0.85rem' }}>
          <Link href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
            <div>上映日期：{movie.releaseDate || '未提供'}</div>
            <div>類型：{movie.types?.join('、') || '未提供'}</div>
            <div>片長：{movie.runTime ? `${movie.runTime}分鐘` : '未提供'}</div>
          </Link>
        </Box>

        <Ratings movie={movie} />
        {children}
      </Box>
    </Paper>
  );
}
