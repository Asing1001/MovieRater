"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memoryCache = require("memory-cache");
const db_1 = require("../data/db");
const Q = require("q");
const mergeData_1 = require("../crawler/mergeData");
const moment = require("moment");
const yahooInTheaterCrawler_1 = require("../crawler/yahooInTheaterCrawler");
const yahooMovieSchduleCrawler_1 = require("../crawler/yahooMovieSchduleCrawler");
class cacheManager {
    static init() {
        console.time('get yahooMovies and pttArticles');
        return Q.spread([db_1.db.getCollection("yahooMovies", { yahooId: -1 }),
            db_1.db.getCollection("pttArticles")], function (yahooMovies, pttArticles) {
            console.timeEnd('get yahooMovies and pttArticles');
            cacheManager.setAllMoviesNamesCache(yahooMovies);
            cacheManager.setAllMoviesCache(yahooMovies, pttArticles);
            cacheManager.setRecentMoviesCache();
            return;
        });
    }
    static setAllMoviesNamesCache(yahooMovies) {
        let allMoviesName = [];
        console.time('setAllMoviesNamesCache');
        yahooMovies.forEach(({ chineseTitle, englishTitle, yahooId, releaseDate }) => {
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
    static setAllMoviesCache(yahooMovies, pttArticles) {
        console.time('mergeData');
        let mergedDatas = mergeData_1.mergeData(yahooMovies, pttArticles);
        console.timeEnd('mergeData');
        memoryCache.put(cacheManager.All_MOVIES, mergedDatas);
    }
    static setRecentMoviesCache() {
        console.time('setRecentMoviesCache');
        return yahooInTheaterCrawler_1.crawlInTheater().then((yahooIds) => {
            let today = moment();
            let recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(({ yahooId, releaseDate }) => yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90);
            memoryCache.put(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');
            return this.setMoviesSchedulesCache(yahooIds);
        });
    }
    static setMoviesSchedulesCache(yahooIds) {
        console.time('setMoviesSchedulesCache');
        let schedulesPromise = yahooIds.map(yahooId => yahooMovieSchduleCrawler_1.default(yahooId));
        return Q.all(schedulesPromise).then(schedules => {
            const allSchedules = [].concat(...schedules);
            memoryCache.put(cacheManager.MOVIES_SCHEDULES, allSchedules);
            console.timeEnd('setMoviesSchedulesCache');
        });
    }
    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }
    static set(key, value) {
        memoryCache.put(key, value);
    }
}
cacheManager.All_MOVIES = 'allMovies';
cacheManager.All_MOVIES_NAMES = 'allMoviesNames';
cacheManager.RECENT_MOVIES = 'recentMovies';
cacheManager.MOVIES_SCHEDULES = 'MoviesSchedules';
exports.default = cacheManager;
//# sourceMappingURL=cacheManager.js.map