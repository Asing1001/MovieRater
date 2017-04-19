import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";
import { mergeData } from '../crawler/mergeData';
import * as moment from 'moment';
import Movie from '../models/movie';
import { getInTheaterYahooIds } from '../crawler/yahooInTheaterCrawler';
import crawlyahooMovieSchdule from '../crawler/yahooMovieSchduleCrawler';
import { roughSizeOfObject } from '../helper/util';

export default class cacheManager {
    static All_MOVIES = 'allMovies';
    static All_MOVIES_NAMES = 'allMoviesNames';
    static RECENT_MOVIES = 'recentMovies';
    static MOVIES_SCHEDULES = 'MoviesSchedules';
    static async init() {
        const yahooMoviesPromise = db.getCollection("yahooMovies", { yahooId: -1 });
        const pttArticlesPromise = db.getCollection("pttArticles");
        console.time('get yahooMovies and pttArticles');
        const [yahooMovies, pttArticles] = await Promise.all([yahooMoviesPromise, pttArticlesPromise]);
        console.timeEnd('get yahooMovies and pttArticles');
        cacheManager.setAllMoviesNamesCache(yahooMovies);
        cacheManager.setAllMoviesCache(yahooMovies, pttArticles);
        cacheManager.setInTheaterMoviesCache();
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

    private static setAllMoviesCache(yahooMovies, pttArticles) {
        console.time('mergeData');
        let mergedDatas = mergeData(yahooMovies, pttArticles);
        console.timeEnd('mergeData');
        cacheManager.set(cacheManager.All_MOVIES, mergedDatas);
    }

    public static async setInTheaterMoviesCache() {
        const yahooIds = await getInTheaterYahooIds();
        if (yahooIds.length > 0) {
            cacheManager.setRecentMoviesCache(yahooIds);
            cacheManager.setMoviesSchedulesCache(yahooIds);
        }
    }

    private static async setRecentMoviesCache(yahooIds) {
        console.time('setRecentMoviesCache');
        let today = moment();
        let recentMovies = cacheManager.get(cacheManager.All_MOVIES)
            .filter(({ yahooId, releaseDate }: Movie) => yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90)
        cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
        console.timeEnd('setRecentMoviesCache');
    }

    private static async setMoviesSchedulesCache(yahooIds: Array<number>) {
        console.time('setMoviesSchedulesCache');
        let schedulesPromise = yahooIds.map(yahooId => crawlyahooMovieSchdule(yahooId));
        const schedules = await Promise.all(schedulesPromise);
        const allSchedules = [].concat(...schedules);
        cacheManager.set(cacheManager.MOVIES_SCHEDULES, allSchedules);
        console.timeEnd('setMoviesSchedulesCache');
    }

    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }

    static set(key, value) {
        memoryCache.put(key, value);
        console.log(`${key} size:${roughSizeOfObject(value)}`);
    }
}
