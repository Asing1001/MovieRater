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
const moment = require("moment");
const db_1 = require("../data/db");
const cacheManager_1 = require("../data/cacheManager");
const imdbCrawler_1 = require("../crawler/imdbCrawler");
function updateImdbInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieInfos = yield getNewImdbInfos();
        logResult(movieInfos);
        yield updateNewImdbInfos(movieInfos);
    });
}
exports.updateImdbInfo = updateImdbInfo;
const imdbLastCrawlTimeFormat = 'YYYY-MM-DDTHH';
function getNewImdbInfos() {
    return __awaiter(this, void 0, void 0, function* () {
        const imdbLastCrawlTime = moment().format(imdbLastCrawlTimeFormat);
        const allMovies = cacheManager_1.default.get(cacheManager_1.default.All_MOVIES);
        const promises = allMovies.filter(filterNeedCrawlMovie).map(({ englishTitle, yahooId }) => __awaiter(this, void 0, void 0, function* () {
            const imdbInfo = yield imdbCrawler_1.getIMDBMovieInfo(englishTitle);
            const movieInfo = Object.assign(imdbInfo, {
                yahooId,
                imdbLastCrawlTime
            });
            return movieInfo;
        }));
        return Promise.all(promises);
    });
}
function filterNeedCrawlMovie({ englishTitle, releaseDate, imdbLastCrawlTime }) {
    const now = moment();
    const isRecentMovie = now.diff(moment(releaseDate), 'months') <= 6;
    const shouldCrawl = englishTitle && (isRecentMovie || (!isRecentMovie && !imdbLastCrawlTime));
    return shouldCrawl;
}
function logResult(movieInfos) {
    const foundMovies = movieInfos.filter(movie => movie.imdbID);
    const notfoundMovieIds = movieInfos.filter(movie => !movie.imdbID).map(movie => movie.yahooId);
    console.log(`Found imdbInfos: ${foundMovies.length}, NotFound: ${notfoundMovieIds.length}`);
    console.log(`Not found YahooIds: ${notfoundMovieIds}`);
}
function updateNewImdbInfos(movieInfos) {
    return __awaiter(this, void 0, void 0, function* () {
        var promises = movieInfos.map(({ yahooId, imdbID, imdbRating, imdbLastCrawlTime }) => {
            const newInfo = imdbID ? { imdbID, imdbRating, imdbLastCrawlTime } : { imdbLastCrawlTime };
            return db_1.db.updateDocument({ yahooId }, newInfo, "yahooMovies");
        });
        yield Promise.all(promises);
    });
}
//# sourceMappingURL=imdbTask.js.map