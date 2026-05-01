'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import type { EnrichedSchedule } from '@/lib/theaters';

function getNextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => moment().add(i, 'days').format('YYYYMMDD'));
}

function RatingBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.4,
        px: 1,
        py: 0.3,
        borderRadius: 1,
        bgcolor: color,
        color: '#fff',
        fontSize: '0.72rem',
        fontWeight: 700,
        lineHeight: 1.4,
      }}
    >
      <span style={{ opacity: 0.85, fontWeight: 400 }}>{label}</span>
      <span>★ {value}</span>
    </Box>
  );
}

export default function TheaterSchedules({ schedules }: { schedules: EnrichedSchedule[] }) {
  const days = getNextDays();
  const [selectedDay, setSelectedDay] = useState(days[0]);

  const filtered = schedules.filter((s) => s.date === selectedDay);

  // Group by lineMovieDbId so each movie appears once with all its showtimes
  const movieMap = new Map<string, EnrichedSchedule & { allTimesStrings: string[]; allRoomTypes: string[] }>();
  for (const s of filtered) {
    const key = s.lineMovieDbId ?? s.movieName ?? '';
    if (!movieMap.has(key)) {
      movieMap.set(key, { ...s, allTimesStrings: [...(s.timesStrings ?? [])], allRoomTypes: [...(s.roomTypes ?? [])] });
    } else {
      const existing = movieMap.get(key)!;
      existing.allTimesStrings.push(...(s.timesStrings ?? []));
      existing.allRoomTypes.push(...(s.roomTypes ?? []));
    }
  }
  const movies = [...movieMap.values()];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>放映場次</Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {days.map((d) => (
          <Chip
            key={d}
            label={d === days[0] ? `今天 ${moment(d).format('MM/DD')}` : moment(d).format('MM/DD ddd')}
            onClick={() => setSelectedDay(d)}
            color={d === selectedDay ? 'primary' : 'default'}
            variant={d === selectedDay ? 'filled' : 'outlined'}
            size="small"
          />
        ))}
      </Box>

      {movies.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>此日無場次資料</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {movies.map((item) => {
            const meta = item.movieMeta;
            const href = meta?.movieBaseId ? `/movie/${meta.movieBaseId}` : null;
            const uniqueRooms = [...new Set(item.allRoomTypes)].filter(Boolean);

            return (
              <Card
                key={item.lineMovieDbId ?? item.movieName}
                variant="outlined"
                sx={{ position: 'relative', borderRadius: 2, '&:hover': { boxShadow: 2 } }}
              >
                <CardContent sx={{ p: '12px !important', display: 'flex', gap: 1.5 }}>
                  {/* Poster */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 64,
                      height: 90,
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: 'grey.200',
                      position: 'relative',
                    }}
                  >
                    {meta?.posterUrl ? (
                      <Image
                        src={meta.posterUrl}
                        alt={meta.chineseTitle ?? ''}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.disabled',
                          fontSize: '1.6rem',
                        }}
                      >
                        🎬
                      </Box>
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Title — stretched-link makes the whole card clickable when href exists */}
                    <Typography
                      fontWeight={700}
                      sx={{ mb: 0.5, lineHeight: 1.3, fontSize: '0.95rem' }}
                    >
                      {href ? (
                        <Box
                          component={Link}
                          href={href}
                          sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              inset: 0,
                              zIndex: 1,
                            },
                          }}
                        >
                          {meta?.chineseTitle ?? item.movieName}
                        </Box>
                      ) : (
                        item.movieName
                      )}
                    </Typography>

                    {/* Genres + runtime */}
                    {(meta?.types?.length || meta?.runTime) && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.75, alignItems: 'center' }}>
                        {meta?.types?.slice(0, 3).map((t) => (
                          <Chip key={t} label={t} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                        ))}
                        {meta?.runTime && (
                          <Typography variant="caption" color="text.secondary">
                            ⏱ {meta.runTime}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Ratings */}
                    {(meta?.imdbRating || meta?.lineRating) && (
                      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1 }}>
                        {meta?.imdbRating && meta.imdbRating !== 'N/A' && (
                          <RatingBadge label="IMDb" value={meta.imdbRating} color="#f5c518cc" />
                        )}
                        {meta?.lineRating && (
                          <RatingBadge label="LINE" value={meta.lineRating} color="#00b90099" />
                        )}
                      </Box>
                    )}

                    {/* Room types */}
                    {uniqueRooms.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {uniqueRooms.join(' · ')}
                      </Typography>
                    )}

                    {/* Showtimes */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.allTimesStrings.map((t, i) => (
                        <Chip
                          key={i}
                          label={t}
                          size="small"
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.75rem', borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
