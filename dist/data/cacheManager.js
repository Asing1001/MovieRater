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
            const yahooMoviesPromise = db_1.db.getCollection("yahooMovies", { yahooId: -1 });
            const pttArticlesPromise = db_1.db.getCollection("pttArticles");
            console.time('get yahooMovies and pttArticles');
            const [yahooMovies, pttArticles] = yield Promise.all([yahooMoviesPromise, pttArticlesPromise]);
            console.timeEnd('get yahooMovies and pttArticles');
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
        this.set(cacheManager.All_MOVIES_NAMES, allMoviesName);
        console.timeEnd('setAllMoviesNamesCache');
    }
    static setAllMoviesCache(yahooMovies, pttArticles) {
        console.time('mergeData');
        let mergedDatas = mergeData_1.mergeData(yahooMovies, pttArticles);
        console.timeEnd('mergeData');
        this.set(cacheManager.All_MOVIES, mergedDatas);
    }
    static setRecentMoviesCache() {
        console.time('setRecentMoviesCache');
        return yahooInTheaterCrawler_1.crawlInTheater().then((yahooIds) => {
            let today = moment();
            let recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(({ yahooId, releaseDate }) => yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90);
            this.set(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');
            return this.setMoviesSchedulesCache(yahooIds);
        });
    }
    static setMoviesSchedulesCache(yahooIds) {
        console.time('setMoviesSchedulesCache');
        let schedulesPromise = yahooIds.map(yahooId => yahooMovieSchduleCrawler_1.default(yahooId));
        return Q.all(schedulesPromise).then(schedules => {
            const allSchedules = [].concat(...schedules);
            this.set(cacheManager.MOVIES_SCHEDULES, allSchedules);
            console.timeEnd('setMoviesSchedulesCache');
        });
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
cacheManager.All_MOVIES = 'allMovies';
cacheManager.All_MOVIES_NAMES = 'allMoviesNames';
cacheManager.RECENT_MOVIES = 'recentMovies';
cacheManager.MOVIES_SCHEDULES = 'MoviesSchedules';
exports.default = cacheManager;
function roughSizeOfObject(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;
    while (stack.length) {
        var value = stack.pop();
        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if (typeof value === 'object'
            && objectList.indexOf(value) === -1) {
            objectList.push(value);
            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}
//# sourceMappingURL=cacheManager.js.map