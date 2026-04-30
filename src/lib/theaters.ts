import cacheManager from '../data/cacheManager';
import Theater from '../models/theater';
import { serialize } from './utils';

export function getTheaters(): Theater[] {
  return serialize(cacheManager.get(cacheManager.THEATERS) ?? []);
}

export function getTheaterByName(name: string): Theater | undefined {
  const theaters: Theater[] = cacheManager.get(cacheManager.THEATERS) ?? [];
  const t = theaters.find((t) => t.name === name);
  return t ? serialize(t) : undefined;
}

export function getSchedulesByMovieName(movieName: string) {
  return serialize(cacheManager.getSchedulesByMovieName(movieName));
}

export function getSchedulesByTheaterUrl(scheduleUrl: string) {
  return serialize(cacheManager.getSchedulesByTheaterUrl(scheduleUrl));
}
