import * as memoryCache from 'memory-cache';
import { Mongo } from '../data/db';
import * as moment from 'moment';
import Movie from '../models/movie';
import { getInTheaterMovieNames } from '../crawler/atmovieInTheaterCrawler';
import {
  getMoviesSchedules,
  updateMoviesSchedules,
} from '../task/atmoviesTask';
import isValideDate from '../helper/isValideDate';

export default class cacheManager {
  static All_MOVIES = 'allMovies';
  static All_MOVIES_NAMES = 'allMoviesNames';
  static RECENT_MOVIES = 'recentMovies';
  static MOVIES_SCHEDULES = 'MoviesSchedules';
  static THEATERS = 'theaters';
  static async init() {
    console.time('Get mergedDatas');
    const mergedDatas = await Mongo.getCollection<Movie>({
      name: 'mergedDatas',
    });
    console.timeEnd('Get mergedDatas');
    cacheManager.set(cacheManager.All_MOVIES, mergedDatas);
    cacheManager.setAllMoviesNamesCache(mergedDatas);
    cacheManager.setTheatersCache();
    await cacheManager.setRecentMoviesCache();
    await cacheManager.setMoviesSchedulesCache();
  }

  private static setAllMoviesNamesCache(yahooMovies: Array<Movie>) {
    let allMoviesName = [];
    console.time('setAllMoviesNamesCache');
    yahooMovies.forEach(({ chineseTitle, englishTitle, yahooId }) => {
      if (chineseTitle) {
        allMoviesName.push({ value: yahooId, text: chineseTitle });
      }
      if (englishTitle && englishTitle !== chineseTitle) {
        allMoviesName.push({ value: yahooId, text: englishTitle });
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
  }

  public static async setRecentMoviesCache() {
    console.time('setRecentMoviesCache');
    const inTheaterMovieNames = await getInTheaterMovieNames();
    const hasInTheaterData = inTheaterMovieNames && inTheaterMovieNames.length;
    const today = moment();
    const recentMovies = cacheManager
      .get(cacheManager.All_MOVIES)
      .filter(({ chineseTitle, releaseDate }: Movie) => {
        const releaseMoment = isValideDate(releaseDate)
          ? moment(releaseDate)
          : moment();
        return (
          (!hasInTheaterData ||
            inTheaterMovieNames.indexOf(chineseTitle) !== -1) &&
          today.diff(releaseMoment, 'days') <= 60
        );
      });
    cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
    console.timeEnd('setRecentMoviesCache');
  }

  public static async setMoviesSchedulesCache() {
    console.time('setMoviesSchedulesCache');
    try {
      await updateMoviesSchedules();
      const allSchedules = await getMoviesSchedules();
      const recentMovieChineseTitles: string[] = cacheManager
        .get(cacheManager.RECENT_MOVIES)
        .map((movie) => movie.chineseTitle);
      const filterdSchedules = allSchedules.filter(
        (schedule) =>
          recentMovieChineseTitles.indexOf(schedule.movieName) !== -1
      );
      cacheManager.set(cacheManager.MOVIES_SCHEDULES, filterdSchedules);
    } catch (ex) {
      console.error(ex);
    }
    console.timeEnd('setMoviesSchedulesCache');
  }

  static get(key) {
    let data = memoryCache.get(key);
    return data;
  }

  static set(key, value) {
    memoryCache.put(key, value);
  }
}
