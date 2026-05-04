import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

export default function MoviePageSkeleton() {
  return (
    <>
      <Paper elevation={0} variant="outlined" sx={{ overflow: 'hidden', mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Skeleton
            variant="rectangular"
            sx={{
              width: { xs: '100%', sm: 200 },
              height: { xs: 300, sm: 300 },
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, p: 2.5 }}>
            <Skeleton variant="text" width="70%" height={36} />
            <Skeleton variant="text" width="45%" height={24} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1.5 }}>
              <Skeleton variant="rounded" width={92} height={32} />
              <Skeleton variant="rounded" width={92} height={32} />
              <Skeleton variant="rounded" width={92} height={32} />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px' }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ display: 'contents' }}>
                  <Skeleton variant="text" width={56} height={20} />
                  <Skeleton variant="text" width={`${index % 2 === 0 ? 70 : 45}%`} height={20} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="100%" height={22} />
          <Skeleton variant="text" width="96%" height={22} />
          <Skeleton variant="text" width="84%" height={22} />
        </Box>
      </Paper>

      <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Skeleton variant="text" width={120} height={28} />
        <Box sx={{ display: 'grid', gap: 1, mt: 1 }}>
          <Skeleton variant="rounded" height={44} />
          <Skeleton variant="rounded" height={44} />
        </Box>
      </Paper>
    </>
  );
}
