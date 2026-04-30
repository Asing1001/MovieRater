import { Mongo } from '../data/db';
import moment from 'moment';
import Movie from '../models/movie';
import { getPlayingMovies } from '../crawler/lineCrawler';
import { getMoviesSchedules, updateMoviesSchedules } from '../task/atmoviesTask';
import isValideDate from '../helper/isValideDate';

// Use globalThis to share cache across module instances (important for Next.js dev mode)
declare global { var __cacheStore: Map<string, any> | undefined; }
if (!globalThis.__cacheStore) globalThis.__cacheStore = new Map<string, any>();

export default class cacheManager {
  private static get _store() { return globalThis.__cacheStore!; }
  static All_MOVIES = 'allMovies';
  static All_MOVIES_NAMES = 'allMoviesNames';
  static MOVIES_BY_CHINESE_TITLE = 'moviesByChineseTitle';
  static RECENT_MOVIES = 'recentMovies';
  static MOVIES_SCHEDULES = 'MoviesSchedules';
  static MOVIES_SCHEDULES_BY_MOVIE_NAME = 'MoviesSchedulesByMovieName';
  static MOVIES_SCHEDULES_BY_THEATER_URL = 'MoviesSchedulesByTheaterUrl';
  static THEATERS = 'theaters';
  static THEATERS_BY_SCHEDULE_URL = 'theatersByScheduleUrl';
  static async init() {
    const mergedDatas = await cacheManager.getMergedDatas();
    cacheManager.set(cacheManager.All_MOVIES, mergedDatas);
    cacheManager.setMovieLookupCache(mergedDatas);
    cacheManager.setAllMoviesNamesCache(mergedDatas);
    await cacheManager.setTheatersCache();
    await cacheManager.setRecentMoviesCache();
    // To let the api return data ASAP, we serve the schedules from Redis first
    await cacheManager.setMoviesSchedulesCache();
    await updateMoviesSchedules();
    await cacheManager.setMoviesSchedulesCache();
  }

  private static async getMergedDatas() {
    console.time('Get mergedDatas');
    const mergedDatas = await Mongo.getCollection<Movie>({
      name: 'mergedDatas',
    });
    console.timeEnd('Get mergedDatas');
    return mergedDatas;
  }

  private static setMovieLookupCache(movies: Array<Movie>) {
    const moviesByChineseTitle = {};
    movies.forEach((movie) => {
      if (movie.chineseTitle && !moviesByChineseTitle[movie.chineseTitle]) {
        moviesByChineseTitle[movie.chineseTitle] = movie;
      }
    });
    cacheManager.set(cacheManager.MOVIES_BY_CHINESE_TITLE, moviesByChineseTitle);
  }

  private static setAllMoviesNamesCache(movies: Array<Movie>) {
    let allMoviesName = [];
    console.time('setAllMoviesNamesCache');
    movies.forEach(({ chineseTitle, englishTitle, movieBaseId }) => {
      if (chineseTitle) {
        allMoviesName.push({ value: movieBaseId, text: chineseTitle });
      }
      if (englishTitle && englishTitle !== chineseTitle) {
        allMoviesName.push({ value: movieBaseId, text: englishTitle });
      }
    });

    cacheManager.set(cacheManager.All_MOVIES_NAMES, allMoviesName);
    console.timeEnd('setAllMoviesNamesCache');
  }

  private static async setTheatersCache() {
    console.time('setTheatersCache');
    const theaterListWithLocation = await Mongo.getCollection({
      name: 'theaters',
      sort: { regionIndex: 1 },
    });
    console.timeEnd('setTheatersCache');
    cacheManager.set(cacheManager.THEATERS, theaterListWithLocation);
    cacheManager.set(cacheManager.THEATERS_BY_SCHEDULE_URL, cacheManager.groupOneBy(theaterListWithLocation, 'scheduleUrl'));
  }

  // This is the list of movies in home page
  public static async setRecentMoviesCache() {
    console.time('setRecentMoviesCache');
    const inTheaterResponse = await getPlayingMovies();
    const inTheaterLineIds = inTheaterResponse.items.map(item => item.id);
    const hasInTheaterData = inTheaterLineIds && inTheaterLineIds.length;
    const today = moment();
    const recentMovies = cacheManager
      .get(cacheManager.All_MOVIES)
      .filter(({ releaseDate, lineMovieId }: Movie) => {
        const hasLINEMovieId = Boolean(lineMovieId);
        const releaseMoment = isValideDate(releaseDate) ? moment(releaseDate) : moment();
        return (
          hasLINEMovieId &&
          (!hasInTheaterData || inTheaterLineIds.indexOf(lineMovieId) !== -1) &&
          today.diff(releaseMoment, 'days') <= 60
        );
      });
    cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
    console.timeEnd('setRecentMoviesCache');
  }

  public static async setMoviesSchedulesCache() {
    console.time('setMoviesSchedulesCache');
    try {
      const allSchedules = await getMoviesSchedules();
      // currently the schedules here has some data that could not mapped to LINE's movie title
      // TODO: get the schedule directly from LINE so we don't need this filter, and the display will be more accurate
      const recentMovieChineseTitles: string[] = cacheManager
        .get(cacheManager.RECENT_MOVIES)
        .map((movie) => movie.chineseTitle);
      const filterdSchedules = allSchedules.filter(
        (schedule) => recentMovieChineseTitles.indexOf(schedule.movieName) !== -1
      );
      cacheManager.set(cacheManager.MOVIES_SCHEDULES, filterdSchedules);
      cacheManager.set(cacheManager.MOVIES_SCHEDULES_BY_MOVIE_NAME, cacheManager.groupBy(filterdSchedules, 'movieName'));
      cacheManager.set(cacheManager.MOVIES_SCHEDULES_BY_THEATER_URL, cacheManager.groupBy(filterdSchedules, 'scheduleUrl'));
    } catch (ex) {
      console.error(ex);
    }
    console.timeEnd('setMoviesSchedulesCache');
  }

  private static groupBy(items: any[], key: string) {
    return items.reduce((groups, item) => {
      const value = item[key];
      if (!value) {
        return groups;
      }
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  }

  private static groupOneBy(items: any[], key: string) {
    return items.reduce((groups, item) => {
      const value = item[key];
      if (value && !groups[value]) {
        groups[value] = item;
      }
      return groups;
    }, {});
  }

  static getMovieByChineseTitle(chineseTitle: string) {
    const moviesByChineseTitle = cacheManager.get(cacheManager.MOVIES_BY_CHINESE_TITLE) || {};
    return moviesByChineseTitle[chineseTitle];
  }

  static getSchedulesByMovieName(movieName: string) {
    const schedulesByMovieName = cacheManager.get(cacheManager.MOVIES_SCHEDULES_BY_MOVIE_NAME) || {};
    return schedulesByMovieName[movieName] || [];
  }

  static getSchedulesByTheaterUrl(scheduleUrl: string) {
    const schedulesByTheaterUrl = cacheManager.get(cacheManager.MOVIES_SCHEDULES_BY_THEATER_URL) || {};
    return schedulesByTheaterUrl[scheduleUrl] || [];
  }

  static getTheaterByScheduleUrl(scheduleUrl: string) {
    const theatersByScheduleUrl = cacheManager.get(cacheManager.THEATERS_BY_SCHEDULE_URL) || {};
    return theatersByScheduleUrl[scheduleUrl];
  }

  static get(key: string) {
    return cacheManager._store.get(key);
  }

  static set(key: string, value: any) {
    cacheManager._store.set(key, value);
  }
}
