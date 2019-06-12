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
const atmovieInTheaterCrawler_1 = require("../crawler/atmovieInTheaterCrawler");
const util_1 = require("../helper/util");
const atmoviesTask_1 = require("../task/atmoviesTask");
const isValideDate_1 = require("../helper/isValideDate");
class cacheManager {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            const yahooMoviesPromise = db_1.db.getCollection({ name: "yahooMovies", sort: { yahooId: -1 } });
            const pttArticlesPromise = db_1.db.getCollection({ name: "pttArticles" });
            console.time('get yahooMovies and pttArticles');
            const [yahooMovies, pttArticles] = yield Promise.all([yahooMoviesPromise, pttArticlesPromise]);
            console.timeEnd('get yahooMovies and pttArticles');
            cacheManager.setAllMoviesNamesCache(yahooMovies);
            cacheManager.setAllMoviesCache(yahooMovies, pttArticles);
            cacheManager.setTheatersCache();
            yield cacheManager.setRecentMoviesCache();
            yield cacheManager.setMoviesSchedulesCache();
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
    static setTheatersCache() {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('setTheatersCache');
            const theaterListWithLocation = yield db_1.db.getCollection({ name: "theaters", sort: { "regionIndex": 1 } });
            console.timeEnd('setTheatersCache');
            cacheManager.set(cacheManager.THEATERS, theaterListWithLocation);
        });
    }
    static setRecentMoviesCache() {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('setRecentMoviesCache');
            const inTheaterMovieNames = yield atmovieInTheaterCrawler_1.getInTheaterMovieNames();
            const hasInTheaterData = inTheaterMovieNames && inTheaterMovieNames.length;
            const today = moment();
            const recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(({ chineseTitle, releaseDate }) => {
                const releaseMoment = isValideDate_1.default(releaseDate) ? moment(releaseDate) : moment();
                return (!hasInTheaterData || inTheaterMovieNames.indexOf(chineseTitle) !== -1) && today.diff(releaseMoment, 'days') <= 60;
            });
            cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');
        });
    }
    static setMoviesSchedulesCache() {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('setMoviesSchedulesCache');
            try {
                yield atmoviesTask_1.updateMoviesSchedules();
                const allSchedules = yield atmoviesTask_1.getMoviesSchedules();
                const recentMovieChineseTitles = cacheManager.get(cacheManager.RECENT_MOVIES).map(movie => movie.chineseTitle);
                const filterdSchedules = allSchedules.filter(schedule => recentMovieChineseTitles.indexOf(schedule.movieName) !== -1);
                cacheManager.set(cacheManager.MOVIES_SCHEDULES, filterdSchedules);
            }
            catch (ex) {
                console.error(ex);
            }
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
cacheManager.THEATERS = 'theaters';
exports.default = cacheManager;
//# sourceMappingURL=cacheManager.js.map