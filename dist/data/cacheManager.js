"use strict";
var memoryCache = require("memory-cache");
var db_1 = require("../data/db");
var Q = require("q");
var mergeData_1 = require("../crawler/mergeData");
var moment = require("moment");
var yahooInTheaterCrawler_1 = require("../crawler/yahooInTheaterCrawler");
var cacheManager = (function () {
    function cacheManager() {
    }
    cacheManager.init = function () {
        console.time('get yahooMovies and pttPages');
        return Q.spread([db_1.db.getCollection("yahooMovies", { yahooId: -1 }),
            db_1.db.getCollection("pttPages", { pageIndex: -1 })], function (yahooMovies, pttPages) {
            console.timeEnd('get yahooMovies and pttPages');
            cacheManager.setAllMoviesNamesCache(yahooMovies);
            cacheManager.setAllMoviesCache(yahooMovies, pttPages);
            cacheManager.setRecentMoviesCache();
            return;
        });
    };
    cacheManager.setAllMoviesNamesCache = function (yahooMovies) {
        var allMoviesName = [];
        console.time('setAllMoviesNamesCache');
        yahooMovies.forEach(function (_a) {
            var chineseTitle = _a.chineseTitle, englishTitle = _a.englishTitle, yahooId = _a.yahooId, releaseDate = _a.releaseDate;
            if (chineseTitle) {
                allMoviesName.push({ value: yahooId, text: chineseTitle });
            }
            if (englishTitle && englishTitle !== chineseTitle) {
                allMoviesName.push({ value: yahooId, text: englishTitle });
            }
        });
        memoryCache.put(cacheManager.All_MOVIES_NAMES, allMoviesName);
        console.timeEnd('setAllMoviesNamesCache');
    };
    cacheManager.setAllMoviesCache = function (yahooMovies, pttPages) {
        console.time('mergeData');
        var mergedDatas = mergeData_1.mergeData(yahooMovies, pttPages);
        console.timeEnd('mergeData');
        memoryCache.put(cacheManager.All_MOVIES, mergedDatas);
    };
    cacheManager.setRecentMoviesCache = function () {
        console.time('setRecentMoviesCache');
        return yahooInTheaterCrawler_1.crawlInTheater().then(function (yahooIds) {
            var today = moment();
            var recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(function (_a) {
                var yahooId = _a.yahooId, releaseDate = _a.releaseDate;
                return yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90;
            });
            memoryCache.put(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');
            return;
        });
    };
    cacheManager.get = function (key) {
        var data = memoryCache.get(key);
        return data;
    };
    return cacheManager;
}());
cacheManager.All_MOVIES = 'allMovies';
cacheManager.All_MOVIES_NAMES = 'allMoviesNames';
cacheManager.RECENT_MOVIES = 'recentMovies';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cacheManager;
//# sourceMappingURL=cacheManager.js.map