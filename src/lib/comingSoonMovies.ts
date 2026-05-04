import { LINEMovieItem } from '@/crawler/lineCrawler';

export interface ComingSoonMovie {
  _id?: unknown;
  lineMovieId: string;
  lineMovieDbId: string;
  lineUrlHash: string | null;
  posterUrl: string | null;
  chineseTitle: string;
  englishTitle?: string;
  releaseDate: string;
  displayReleaseDate: string;
  releaseMonth: string;
  releaseWeekday: string;
  types: string[];
  runTime?: string;
  directors: string[];
  actors: string[];
  launchCompany?: string;
  summary: string;
  lineTrailerHash: string | null;
  likeCount: number;
  certificate?: string;
  broadcastStatus?: string;
  source?: string;
  updatedAt?: string;
}

export interface ComingSoonDateGroup {
  releaseDate: string;
  displayReleaseDate: string;
  releaseWeekday: string;
  movies: ComingSoonMovie[];
}

export interface ComingSoonMonthGroup {
  month: string;
  displayMonth: string;
  dates: ComingSoonDateGroup[];
}

const TAIPEI_TIME_ZONE = 'Asia/Taipei';

function taipeiDateParts(timestamp: number) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TAIPEI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(timestamp));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
  };
}

function formatTaipeiDate(timestamp: number) {
  const { year, month, day } = taipeiDateParts(timestamp);
  return `${year}-${month}-${day}`;
}

function formatTaipeiWeekday(date: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    timeZone: TAIPEI_TIME_ZONE,
    weekday: 'short',
  }).format(new Date(`${date}T00:00:00+08:00`));
}

function stripHtml(value?: string | null) {
  return (value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactArray<T>(value?: T[] | null): T[] {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function mapLineComingSoonMovie(item: LINEMovieItem): ComingSoonMovie {
  const releaseDate = formatTaipeiDate(item.releaseDate);
  const [, month, day] = releaseDate.split('-');
  const trailerHash = item.mainTrailer?.url?.hash ?? item.latestTrailer?.hash ?? null;
  const runtime = Number(item.runtime);

  return {
    lineMovieId: item.id,
    lineMovieDbId: item.movieId,
    lineUrlHash: item.url?.hash ?? null,
    posterUrl: item.thumbnail?.hash ? `https://obs.line-scdn.net/${item.thumbnail.hash}/w280` : null,
    chineseTitle: item.title,
    englishTitle: item.engTitle,
    releaseDate,
    displayReleaseDate: `${Number(month)}/${Number(day)}`,
    releaseMonth: releaseDate.slice(0, 7),
    releaseWeekday: formatTaipeiWeekday(releaseDate),
    types: compactArray(item.genres),
    runTime: runtime > 0 ? String(runtime) : undefined,
    directors: compactArray(item.directors),
    actors: compactArray(item.cast),
    launchCompany: item.production,
    summary: stripHtml(item.shortDescription || item.synopsis),
    lineTrailerHash: trailerHash,
    likeCount: Number(item.likeCount) || 0,
    certificate: item.certificate,
    broadcastStatus: item.broadcastStatus,
    source: item.source,
    updatedAt: new Date().toISOString(),
  };
}

function displayMonth(month: string) {
  const [year, monthNumber] = month.split('-');
  return `${year} 年 ${Number(monthNumber)} 月`;
}

export function groupComingSoonMoviesByMonth(movies: ComingSoonMovie[]): ComingSoonMonthGroup[] {
  const sorted = [...movies].sort((a, b) => {
    const dateDiff = a.releaseDate.localeCompare(b.releaseDate);
    if (dateDiff !== 0) return dateDiff;
    return (b.likeCount ?? 0) - (a.likeCount ?? 0);
  });

  const monthMap = new Map<string, Map<string, ComingSoonDateGroup>>();
  for (const movie of sorted) {
    if (!monthMap.has(movie.releaseMonth)) {
      monthMap.set(movie.releaseMonth, new Map());
    }
    const dateMap = monthMap.get(movie.releaseMonth)!;
    if (!dateMap.has(movie.releaseDate)) {
      dateMap.set(movie.releaseDate, {
        releaseDate: movie.releaseDate,
        displayReleaseDate: movie.displayReleaseDate,
        releaseWeekday: movie.releaseWeekday,
        movies: [],
      });
    }
    dateMap.get(movie.releaseDate)!.movies.push(movie);
  }

  return [...monthMap.entries()].map(([month, dates]) => ({
    month,
    displayMonth: displayMonth(month),
    dates: [...dates.values()],
  }));
}

export function getComingSoonStartMonths(count = 3, now = new Date()): string[] {
  const { year, month } = taipeiDateParts(now.getTime());
  const startYear = Number(year);
  const startMonth = Number(month);

  return Array.from({ length: count }, (_, index) => {
    const zeroBased = startMonth - 1 + index;
    const yearValue = startYear + Math.floor(zeroBased / 12);
    const monthValue = (zeroBased % 12) + 1;
    return `${yearValue}-${String(monthValue).padStart(2, '0')}`;
  });
}

export function getTaipeiDateString(now = new Date()): string {
  return formatTaipeiDate(now.getTime());
}
