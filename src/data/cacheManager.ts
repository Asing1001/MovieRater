import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";
import { mergeData } from '../crawler/mergeData';
import * as moment from 'moment';
import Movie from '../models/movie';
import { crawlInTheater } from '../crawler/yahooInTheaterCrawler';


export default class cacheManager {
    static All_MOVIES = 'allMovies';
    static All_MOVIES_NAMES = 'allMoviesNames';
    static RECENT_MOVIES = 'recentMovies';
    static init() {
        console.time('get yahooMovies and pttPages');
        return Q.spread([db.getCollection("yahooMovies", { yahooId: -1 }),
        db.getCollection("pttPages", { pageIndex: -1 })],
            function (yahooMovies, pttPages) {
                console.timeEnd('get yahooMovies and pttPages');
                cacheManager.setAllMoviesNamesCache(yahooMovies);
                cacheManager.setAllMoviesCache(yahooMovies, pttPages);
                cacheManager.setRecentMoviesCache(yahooMovies);
                return;
            });
    }



    private static setAllMoviesNamesCache(yahooMovies: Array<Movie>) {
        let allMoviesName = [];
        console.time('setAllMoviesNamesCache');
        yahooMovies.forEach(({chineseTitle, englishTitle, yahooId, releaseDate}) => {
            if (chineseTitle) {
                allMoviesName.push({ value: yahooId, text: chineseTitle });
            }
            if (englishTitle && englishTitle !== chineseTitle) {
                allMoviesName.push({ value: yahooId, text: englishTitle });
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

    private static setRecentMoviesCache(yahooMovies: Array<Movie>) {
        console.time('setRecentMoviesCache');
        return crawlInTheater().then((yahooIds: Array<number>) => {
            let today = moment();
            let recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(({yahooId, releaseDate}:Movie) => yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90) 
            memoryCache.put(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');
            return;
        })
    }

    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }
}