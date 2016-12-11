import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";
import { mergeData } from '../crawler/mergeData';
import * as moment from 'moment';
import Movie from '../models/movie';


export default class cacheManager {
    static All_MOVIES = 'allMovies';
    static All_MOVIES_NAMES = 'allMoviesNames';
    static RECENT_MOVIES = 'recentMovies';
    static init() {
        console.time('get yahooMovies and pttPages');
        return Q.spread([db.getCollection("yahooMovies", { yahooId: 1 }),
        db.getCollection("pttPages", { pageIndex: -1 })],
            function (yahooMovies, pttPages) {
                console.timeEnd('get yahooMovies and pttPages');
                cacheManager.setRecentMoviesCache(yahooMovies);
                cacheManager.setAllMoviesNamesCache(yahooMovies);
                cacheManager.setAllMoviesCache(yahooMovies, pttPages);
                return;
            });
    }

    private static setRecentMoviesCache(yahooMovies: Array<Movie>) {
        let twoMonthsBeforeNow = moment().subtract(2, 'months');
        let now = moment();
        console.time('setRecentMoviesCache');
        let recentMovies = yahooMovies.filter(({releaseDate}) => {
            return moment(releaseDate).isBetween(twoMonthsBeforeNow, now);
        });
        memoryCache.put(cacheManager.RECENT_MOVIES, recentMovies);
        console.timeEnd('setRecentMoviesCache');
    }

    private static setAllMoviesNamesCache(yahooMovies: Array<Movie>) {
        let allMoviesName = [];
        let threeWeeksAfterNow = moment().add(21, 'days');
        console.time('setAllMoviesNamesCache');
        yahooMovies.forEach(({chineseTitle, englishTitle, yahooId, releaseDate}) => {
            let isFarInFuture = moment(releaseDate).isAfter(threeWeeksAfterNow);
            if (chineseTitle) {
                isFarInFuture ? allMoviesName.push({ value: yahooId, text: chineseTitle }) : allMoviesName.unshift({ value: yahooId, text: chineseTitle });
            }
            if (englishTitle && englishTitle !== chineseTitle) {
                isFarInFuture ? allMoviesName.push({ value: yahooId, text: englishTitle }) : allMoviesName.unshift({ value: yahooId, text: englishTitle });
            }
        });

        memoryCache.put(cacheManager.All_MOVIES_NAMES, allMoviesName);
        console.timeEnd('setAllMoviesNamesCache');
    }

    private static setAllMoviesCache(yahooMovies, pttPages) {
        console.time('mergeData');
        let mergedDatas = mergeData(yahooMovies, pttPages);
        console.timeEnd('mergeData');
        memoryCache.put(cacheManager.All_MOVIES, mergedDatas);
    }

    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }
}