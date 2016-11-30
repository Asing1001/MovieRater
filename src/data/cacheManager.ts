import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";
import { mergeData } from '../crawler/mergeData';

export default class cacheManager {
    static cacheKey = 'allMovies';
    static init() {
        console.time('get yahooMovies and pttPages');
        return Q.spread([db.getCollection("yahooMovies", { yahooId: -1 }),
        db.getCollection("pttPages", { pageIndex: -1 })],
            function (yahooMovies, pttPages) {
                console.timeEnd('get yahooMovies and pttPages');
                memoryCache.put(cacheManager.cacheKey, yahooMovies);
                console.time('mergeData');
                let mergedDatas = mergeData(yahooMovies, pttPages);
                console.timeEnd('mergeData');
                return memoryCache.put(cacheManager.cacheKey, mergedDatas);
            });
    }

    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }
}