import * as memoryCache from 'memory-cache';
import { Mongo } from '../data/db';
import * as moment from 'moment';
import Movie from '../models/movie';
import { getInTheaterMovieNames } from '../crawler/atmovieInTheaterCrawler';
import { getMoviesSchedules, updateMoviesSchedules } from '../task/atmoviesTask';
import isValideDate from '../helper/isValideDate';

export default class cacheManager {
  static All_MOVIES = 'allMovies';
  static All_MOVIES_NAMES = 'allMoviesNames';
  static RECENT_MOVIES = 'recentMovies';
  static MOVIES_SCHEDULES = 'MoviesSchedules';
  static THEATERS = 'theaters';
  static async init() {
    const mergedDatas = await cacheManager.getMergedDatas();
    cacheManager.set(cacheManager.All_MOVIES, mergedDatas);
    cacheManager.setAllMoviesNamesCache(mergedDatas);
    cacheManager.setTheatersCache();
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
  }

  public static async setRecentMoviesCache() {
    console.time('setRecentMoviesCache');
    const inTheaterMovieNames = await getInTheaterMovieNames();
    const hasInTheaterData = inTheaterMovieNames && inTheaterMovieNames.length;
    const today = moment();
    const recentMovies = cacheManager
      .get(cacheManager.All_MOVIES)
      .filter(({ chineseTitle, releaseDate, lineMovieId }: Movie) => {
        // The movie with yahooId does not have image.
        const hasLINEMovieId = Boolean(lineMovieId);
        const releaseMoment = isValideDate(releaseDate) ? moment(releaseDate) : moment();
        return (
          hasLINEMovieId &&
          (!hasInTheaterData || inTheaterMovieNames.indexOf(chineseTitle) !== -1) &&
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
