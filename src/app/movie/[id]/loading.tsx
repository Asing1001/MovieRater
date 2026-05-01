import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6, gap: 2 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">載入電影資料…</Typography>
    </Box>
  );
}
