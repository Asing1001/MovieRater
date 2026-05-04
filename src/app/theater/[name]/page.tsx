import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Mongo } from '@/data/db';
import { COLLECTIONS } from '@/data/collections';
import Theater from '@/models/theater';
import Schedule from '@/models/schedule';
import Movie from '@/models/movie';
import { serialize } from '@/lib/utils';
import { buildMetadata, jsonLd, theaterJsonLd, theaterPath } from '@/lib/seo';
import type { EnrichedSchedule, MovieMeta } from '@/lib/theaters';
import TheaterSchedules from '@/components/TheaterSchedules';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { Metadata } from 'next';

export const revalidate = 3600;

type Props = { params: Promise<{ name: string }> };

const fetchTheater = cache(async (name: string): Promise<Theater | null> => {
  await Mongo.openDbConnection();
  const decoded = decodeURIComponent(name);
  const theaterCollection = Mongo.db.collection<Theater>(COLLECTIONS.theaters);
  return serialize(
    await theaterCollection.findOne({
      name: decoded,
      lineTheaterId: { $exists: true, $nin: [null, ''] },
    }) ?? await theaterCollection.findOne({ name: decoded })
  );
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const theater = await fetchTheater(name);
  return buildMetadata({
    title: `${theater?.name ?? decoded} - Movie Rater`,
    description: theater
      ? `查詢${theater.name}電影時刻表、地址${theater.address ? `「${theater.address}」` : ''}與聯絡資訊。`
      : `查詢${decoded}電影時刻表、地址與聯絡資訊。`,
    path: theaterPath(theater?.name ?? decoded),
  });
}

export default async function TheaterPage({ params }: Props) {
  const { name } = await params;
  const theater = await fetchTheater(name);
  if (!theater) notFound();

  const schedules = serialize(
    theater.lineTheaterId
      ? await Mongo.db
          .collection<Schedule>(COLLECTIONS.schedules)
          .find({ lineTheaterId: theater.lineTheaterId })
          .toArray()
      : []
  );

  // Enrich schedules with movie metadata for poster/rating display.
  // Query movieBases directly; mergedDatas may be stale.
  const lineMovieDbIds = [...new Set(schedules.map((s) => s.lineMovieDbId).filter(Boolean))];
  const movieDocs = lineMovieDbIds.length
    ? await Mongo.db
        .collection(COLLECTIONS.movieBases)
        .find({ lineMovieDbId: { $in: lineMovieDbIds } })
        .project({ lineMovieDbId: 1, _id: 1, posterUrl: 1, chineseTitle: 1, englishTitle: 1, imdbRating: 1, imdbID: 1, lineRating: 1, lineUrlHash: 1, types: 1, runTime: 1 })
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(theaterJsonLd(theater)) }} />
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
