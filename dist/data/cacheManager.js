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
const mergeData_1 = require("../crawler/mergeData");
const moment = require("moment");
const yahooInTheaterCrawler_1 = require("../crawler/yahooInTheaterCrawler");
const yahooMovieSchduleCrawler_1 = require("../crawler/yahooMovieSchduleCrawler");
const util_1 = require("../helper/util");
class cacheManager {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            const yahooMoviesPromise = db_1.db.getCollection("yahooMovies", { yahooId: -1 });
            const pttArticlesPromise = db_1.db.getCollection("pttArticles");
            console.time('get yahooMovies and pttArticles');
            const [yahooMovies, pttArticles] = yield Promise.all([yahooMoviesPromise, pttArticlesPromise]);
            console.timeEnd('get yahooMovies and pttArticles');
            cacheManager.setAllMoviesNamesCache(yahooMovies);
            cacheManager.setAllMoviesCache(yahooMovies, pttArticles);
            cacheManager.setInTheaterMoviesCache();
        });
    }
    static setAllMoviesNamesCache(yahooMovies) {
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
    static setAllMoviesCache(yahooMovies, pttArticles) {
        console.time('mergeData');
        let mergedDatas = mergeData_1.mergeData(yahooMovies, pttArticles);
        console.timeEnd('mergeData');
        cacheManager.set(cacheManager.All_MOVIES, mergedDatas);
    }
    static setInTheaterMoviesCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const yahooIds = yield yahooInTheaterCrawler_1.getInTheaterYahooIds();
            if (yahooIds.length > 0) {
                cacheManager.setRecentMoviesCache(yahooIds);
                cacheManager.setMoviesSchedulesCache(yahooIds);
            }
        });
    }
    static setRecentMoviesCache(yahooIds) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('setRecentMoviesCache');
            let today = moment();
            let recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(({ yahooId, releaseDate }) => yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90);
            cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');
        });
    }
    static setMoviesSchedulesCache(yahooIds) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('setMoviesSchedulesCache');
            let schedulesPromise = yahooIds.map(yahooId => yahooMovieSchduleCrawler_1.default(yahooId));
            const schedules = yield Promise.all(schedulesPromise);
            const allSchedules = [].concat(...schedules);
            cacheManager.set(cacheManager.MOVIES_SCHEDULES, allSchedules);
            console.timeEnd('setMoviesSchedulesCache');
        });
    }
    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }
    static set(key, value) {
        memoryCache.put(key, value);
        console.log(`${key} size:${util_1.roughSizeOfObject(value)}`);
    }
}
cacheManager.All_MOVIES = 'allMovies';
cacheManager.All_MOVIES_NAMES = 'allMoviesNames';
cacheManager.RECENT_MOVIES = 'recentMovies';
cacheManager.MOVIES_SCHEDULES = 'MoviesSchedules';
exports.default = cacheManager;
//# sourceMappingURL=cacheManager.js.map