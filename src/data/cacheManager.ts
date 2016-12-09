import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";
import { mergeData } from '../crawler/mergeData';

export default class cacheManager {
    static All_MOVIES = 'allMovies';
    static All_MOVIES_NAMES = 'allMoviesNames';
    static init() {
        console.time('get yahooMovies and pttPages');
        return Q.spread([db.getCollection("yahooMovies", { yahooId: -1 }),
        db.getCollection("pttPages", { pageIndex: -1 })],
            function (yahooMovies, pttPages) {
                console.timeEnd('get yahooMovies and pttPages');
                cacheManager.setAllMoviesNamesCache(yahooMovies);
                cacheManager.setAllMoviesCache(yahooMovies, pttPages);
                return;
            });
    }

    private static setAllMoviesNamesCache(yahooMovies) {
        let allMoviesName = [];
        console.time('setAllMoviesNamesCache');
        yahooMovies.forEach(({chineseTitle, englishTitle, yahooId}) => {
            if (chineseTitle) {
                allMoviesName.push({ value: yahooId, text: chineseTitle })
            }
            if (englishTitle && englishTitle !== chineseTitle) {
                allMoviesName.push({ value: yahooId, text: englishTitle })
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