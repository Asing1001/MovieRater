import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';

export default function TheatersPageSkeleton() {
  return (
    <>
      <Skeleton variant="text" width={112} height={32} sx={{ mb: 1 }} />
      {Array.from({ length: 4 }).map((_, regionIndex) => (
        <Box key={regionIndex}>
          <Skeleton variant="text" width={72} height={24} sx={{ mt: 2, mb: 0.5 }} />
          <Divider />
          <List dense>
            {Array.from({ length: regionIndex === 0 ? 4 : 3 }).map((__, itemIndex) => (
              <ListItem key={itemIndex} disablePadding sx={{ py: 0.75 }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width={`${itemIndex % 2 === 0 ? 52 : 68}%`} height={24} />
                  <Skeleton variant="text" width={`${itemIndex % 2 === 0 ? 78 : 58}%`} height={18} />
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </>
  );
}
