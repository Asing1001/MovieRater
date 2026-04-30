'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Schedule from '@/models/schedule';
import moment from 'moment';

function getNextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => moment().add(i, 'days').format('YYYYMMDD'));
}

export default function Schedules({ schedules, titleKey = 'theaterName' }: { schedules: Schedule[]; titleKey?: 'theaterName' | 'movieName' }) {
  const days = getNextDays();
  const [selectedDay, setSelectedDay] = useState(days[0]);

  const filtered = schedules.filter((s) => s.date === selectedDay);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>放映時刻</Typography>
      <div className="date-wrapper">
        {days.map((d) => (
          <Chip
            key={d}
            label={moment(d).format('MM/DD')}
            onClick={() => setSelectedDay(d)}
            color={d === selectedDay ? 'primary' : 'default'}
            variant={d === selectedDay ? 'filled' : 'outlined'}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 1 }}>此日無場次資料</Typography>
      ) : (
        filtered.map((s, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 1.5, mt: 1 }}>
            <Typography fontWeight={600}>{s[titleKey]}</Typography>
            {s.roomTypes?.length ? (
              <Typography variant="caption" color="text.secondary">{s.roomTypes.join(' / ')}</Typography>
            ) : null}
            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {s.timesStrings?.map((t, j) => (
                <Chip key={j} label={t} size="small" variant="outlined" />
              ))}
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}
