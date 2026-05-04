import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function MovieCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 1.5,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        bgcolor: 'background.paper',
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          flexShrink: 0,
          width: { xs: 90, sm: 120 },
          height: { xs: 130, sm: 175 },
        }}
      />
      <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
        <Skeleton variant="text" width="72%" height={28} />
        <Skeleton variant="text" width="44%" height={18} sx={{ mb: 0.75 }} />
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1 }}>
          <Skeleton variant="text" width={72} height={18} />
          <Skeleton variant="text" width={92} height={18} />
          <Skeleton variant="text" width={48} height={18} />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
          <Skeleton variant="rounded" width={88} height={30} />
          <Skeleton variant="rounded" width={88} height={30} />
          <Skeleton variant="rounded" width={88} height={30} />
        </Box>
        <Skeleton variant="text" width="100%" height={18} />
        <Skeleton variant="text" width="82%" height={18} />
      </Box>
    </Box>
  );
}

export default function MovieListPageSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </>
  );
}
