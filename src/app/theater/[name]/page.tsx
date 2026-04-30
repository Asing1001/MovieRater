import { notFound } from 'next/navigation';
import { Mongo } from '@/data/db';
import Theater from '@/models/theater';
import Schedule from '@/models/schedule';
import Movie from '@/models/movie';
import { serialize } from '@/lib/utils';
import type { EnrichedSchedule, MovieMeta } from '@/lib/theaters';
import TheaterSchedules from '@/components/TheaterSchedules';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { Metadata } from 'next';

export const revalidate = 3600;

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} - Movie Rater` };
}

export default async function TheaterPage({ params }: Props) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);

  await Mongo.openDbConnection();
  const theater = serialize(
    await Mongo.db.collection<Theater>('theaters').findOne({ name: decoded })
  );
  if (!theater) notFound();

  const schedules = serialize(
    await Mongo.db
      .collection<Schedule>('schedules')
      .find({ lineTheaterId: theater.lineTheaterId ?? null })
      .toArray()
  );

  // Enrich schedules with movie metadata for poster/rating display.
  // Query yahooMovies (written by lineTask) — mergedDatas may be stale.
  const lineMovieDbIds = [...new Set(schedules.map((s) => s.lineMovieDbId).filter(Boolean))];
  const movieDocs = lineMovieDbIds.length
    ? await Mongo.db
        .collection('yahooMovies')
        .find({ lineMovieDbId: { $in: lineMovieDbIds } })
        .project({ lineMovieDbId: 1, _id: 1, posterUrl: 1, chineseTitle: 1, englishTitle: 1, imdbRating: 1, lineRating: 1, types: 1, runTime: 1 })
        .toArray()
    : [];
  const movieByLineId: Record<string, MovieMeta> = {};
  for (const m of movieDocs) {
    if (m.lineMovieDbId) {
      movieByLineId[m.lineMovieDbId] = serialize({
        ...m,
        movieBaseId: m._id?.toString?.() ?? String(m._id),
      } as MovieMeta);
    }
  }

  const enrichedSchedules: EnrichedSchedule[] = schedules.map((s) => ({
    ...s,
    movieMeta: s.lineMovieDbId ? movieByLineId[s.lineMovieDbId] : undefined,
  }));

  return (
    <Box>
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

      {enrichedSchedules.length > 0 ? (
        <TheaterSchedules schedules={enrichedSchedules} />
      ) : (
        <Typography color="text.secondary">目前無場次資料</Typography>
      )}
    </Box>
  );
}
