import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function UpcomingMovieSkeleton() {
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
      <Skeleton variant="rounded" sx={{ width: '100%', aspectRatio: '2 / 3' }} />
      <Box sx={{ minWidth: 0 }}>
        <Skeleton variant="text" width="74%" height={26} />
        <Skeleton variant="text" width="46%" height={18} sx={{ mb: 0.75 }} />
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          <Skeleton variant="rounded" width={52} height={24} />
          <Skeleton variant="rounded" width={58} height={24} />
          <Skeleton variant="rounded" width={52} height={24} />
        </Box>
        <Skeleton variant="text" width="100%" height={18} />
        <Skeleton variant="text" width="78%" height={18} />
        <Skeleton variant="rounded" width={76} height={30} sx={{ mt: 1 }} />
      </Box>
    </Box>
  );
}

export default function UpcomingPageSkeleton() {
  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ mb: 2.5 }}>
        <Skeleton variant="text" width={128} height={36} />
        <Skeleton variant="text" width="86%" height={22} />
      </Box>

      <Stack spacing={3}>
        {Array.from({ length: 2 }).map((_, monthIndex) => (
          <Box key={monthIndex}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width={120} height={32} />
            </Box>
            <Stack spacing={1.5}>
              {Array.from({ length: 2 }).map((__, dateIndex) => (
                <Box
                  key={dateIndex}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '52px minmax(0, 1fr)', sm: '72px minmax(0, 1fr)' },
                    gap: { xs: 1, sm: 1.5 },
                    alignItems: 'start',
                  }}
                >
                  <Box sx={{ pt: 0.5, textAlign: 'center' }}>
                    <Skeleton variant="text" width={44} height={24} sx={{ mx: 'auto' }} />
                    <Skeleton variant="text" width={28} height={18} sx={{ mx: 'auto' }} />
                  </Box>
                  <UpcomingMovieSkeleton />
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
