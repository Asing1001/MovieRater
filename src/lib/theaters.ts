import cacheManager from '../data/cacheManager';
import Theater from '../models/theater';

export function getTheaters(): Theater[] {
  return cacheManager.get(cacheManager.THEATERS) ?? [];
}

export function getTheaterByName(name: string): Theater | undefined {
  const theaters: Theater[] = cacheManager.get(cacheManager.THEATERS) ?? [];
  return theaters.find((t) => t.name === name);
}

export function getSchedulesByMovieName(movieName: string) {
  return cacheManager.getSchedulesByMovieName(movieName);
}

export function getSchedulesByTheaterUrl(scheduleUrl: string) {
  return cacheManager.getSchedulesByTheaterUrl(scheduleUrl);
}
