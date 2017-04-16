"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            console.time('get yahooMovies');
            const yahooMovies = yield db_1.db.getCollection("yahooMovies", { yahooId: -1 });
            console.timeEnd('get yahooMovies');
            console.time('get pttArticles');
            const pttArticles = yield db_1.db.getCollection("pttArticles");
            console.timeEnd('get pttArticles');
            cacheManager.setAllMoviesNamesCache(yahooMovies);
            cacheManager.setAllMoviesCache(yahooMovies, pttArticles);
            cacheManager.setRecentMoviesCache();
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