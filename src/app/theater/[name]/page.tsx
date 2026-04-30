import { notFound } from 'next/navigation';
import { getTheaterByName, getEnrichedSchedulesByLineTheaterId, getSchedulesByTheaterName } from '@/lib/theaters';
import { serialize } from '@/lib/utils';
import TheaterSchedules from '@/components/TheaterSchedules';
import type { EnrichedSchedule } from '@/lib/theaters';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

  const enrichedSchedules: EnrichedSchedule[] = theater.lineTheaterId
    ? getEnrichedSchedulesByLineTheaterId(theater.lineTheaterId)
    : (serialize(getSchedulesByTheaterName(theater.name ?? '')) as EnrichedSchedule[]);

  return (
    <Box>
      {/* Theater header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          {(theater.theaterCity ?? theater.region) && (
            <Chip
              label={theater.theaterCity ?? theater.region}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2, mb: 0.75 }}>
          {theater.name}
        </Typography>
        {theater.address && (
          <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            📍 {theater.address}
          </Typography>
        )}
        {theater.phone && (
          <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            📞 {theater.phone}
          </Typography>
        )}
      </Box>

      {/* Schedule */}
      {enrichedSchedules.length > 0 ? (
        <TheaterSchedules schedules={enrichedSchedules} />
      ) : (
        <Typography color="text.secondary">目前無場次資料</Typography>
      )}
    </Box>
  );
}
