import { notFound } from 'next/navigation';
import { getTheaterByName, getSchedulesByTheaterUrl } from '@/lib/theaters';
import Schedules from '@/components/Schedules';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import type { Metadata } from 'next';

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} - Movie Rater` };
}

export default async function TheaterPage({ params }: Props) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const theater = getTheaterByName(decoded);
  if (!theater) notFound();

  const schedules = theater.scheduleUrl ? getSchedulesByTheaterUrl(theater.scheduleUrl) : [];

  return (
    <>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>{theater.name}</Typography>
        {theater.address && <Typography color="text.secondary">{theater.address}</Typography>}
        {theater.phone && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">電話：{theater.phone}</Typography>
          </Box>
        )}
      </Paper>
      {schedules.length > 0 ? (
        <Schedules schedules={schedules} />
      ) : (
        <Typography color="text.secondary">目前無場次資料</Typography>
      )}
    </>
  );
}
