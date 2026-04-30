import cacheManager from '../data/cacheManager';
import Theater from '../models/theater';
import Schedule from '../models/schedule';
import { serialize } from './utils';

export type MovieMeta = {
  movieBaseId?: string;
  posterUrl?: string;
  chineseTitle?: string;
  englishTitle?: string;
  imdbRating?: string;
  lineRating?: string;
  types?: string[];
  runTime?: string;
};

export type EnrichedSchedule = Schedule & { movieMeta?: MovieMeta };

export function getEnrichedSchedulesByLineTheaterId(lineTheaterId: string): EnrichedSchedule[] {
  const schedules: Schedule[] = cacheManager.getSchedulesByLineTheaterId(lineTheaterId);
  return serialize(
    schedules.map((s) => {
      if (!s.lineMovieDbId) return s;
      const m = cacheManager.getMovieByLineMovieDbId(s.lineMovieDbId);
      if (!m) return s;
      return {
        ...s,
        movieMeta: {
          movieBaseId: m.movieBaseId,
          posterUrl: m.posterUrl,
          chineseTitle: m.chineseTitle,
          englishTitle: m.englishTitle,
          imdbRating: m.imdbRating,
          lineRating: m.lineRating,
          types: m.types,
          runTime: m.runTime,
        } as MovieMeta,
      };
    })
  );
}

export function getTheaters(): Theater[] {
  const all: Theater[] = cacheManager.get(cacheManager.THEATERS) ?? [];
  return serialize(all.filter((t) => t.lineTheaterId));
}

export function getTheaterByName(name: string): Theater | undefined {
  const theaters: Theater[] = cacheManager.get(cacheManager.THEATERS) ?? [];
  const t = theaters.find((t) => t.name === name);
  return t ? serialize(t) : undefined;
}

export function getSchedulesByLineMovieDbId(lineMovieDbId: string) {
  return serialize(cacheManager.getSchedulesByLineMovieDbId(lineMovieDbId));
}

export function getSchedulesByTheaterName(theaterName: string) {
  return serialize(cacheManager.getSchedulesByTheaterName(theaterName));
}

export function getSchedulesByLineTheaterId(lineTheaterId: string) {
  return serialize(cacheManager.getSchedulesByLineTheaterId(lineTheaterId));
}
