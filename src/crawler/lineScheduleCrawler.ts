import Schedule from '../models/schedule';

const BASE = 'https://today.line.me/webapi/movie/showtimes';

function msToTimeString(ms: number): string {
  return new Date(ms).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });
}

export async function crawlLineSchedules(lineMovieDbId: string, dates: string[]): Promise<Schedule[]> {
  const results: Schedule[] = [];
  for (const date of dates) {
    const isoDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    try {
      const res = await fetch(`${BASE}?country=tw&movieId=${lineMovieDbId}&date=${isoDate}`);
      if (!res.ok) continue;
      const { items } = await res.json();
      for (const theater of items ?? []) {
        for (const sv of theater.showtimeViews ?? []) {
          results.push({
            lineMovieDbId,
            lineTheaterId: theater.id,
            theaterName: theater.name,
            theaterCity: theater.city,
            movieName: sv.filmTitle,
            date,
            roomTypes: sv.format?.length ? [sv.format.join(' ')] : [],
            timesStrings: (sv.showTimes ?? []).map(msToTimeString),
          });
        }
      }
    } catch (err) {
      console.error(`crawlLineSchedules failed for movieId=${lineMovieDbId} date=${date}:`, err);
    }
  }
  return results;
}
