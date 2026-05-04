import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

export default function TheaterPageSkeleton() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Chip
          label={<Skeleton variant="text" width={48} />}
          size="small"
          variant="outlined"
          sx={{ mb: 0.5, width: 72 }}
        />
        <Skeleton variant="text" width="68%" height={48} />
        <Skeleton variant="text" width="86%" height={24} />
        <Skeleton variant="text" width="38%" height={24} />
      </Box>

      <Skeleton variant="text" width={96} height={32} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="rounded" width={index === 0 ? 88 : 68} height={32} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Skeleton variant="rounded" width={64} height={90} sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="72%" height={24} />
                <Skeleton variant="text" width="42%" height={18} sx={{ mb: 0.5 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
                  <Skeleton variant="rounded" width={78} height={28} />
                  <Skeleton variant="rounded" width={78} height={28} />
                </Box>
                <Skeleton variant="text" width="55%" height={18} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
                  <Skeleton variant="rounded" width={54} height={24} />
                  <Skeleton variant="rounded" width={54} height={24} />
                  <Skeleton variant="rounded" width={54} height={24} />
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
