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
const imdbCrawler_1 = require("../crawler/imdbCrawler");
function updateImdbInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let movieInfos = yield getNewImdbInfos();
        removeEmptyInfos(movieInfos);
        logResult(movieInfos);
        return updateYahooMovies(movieInfos);
    });
}
exports.updateImdbInfo = updateImdbInfo;
const imdbLastCrawlTimeFormat = 'YYYY-MM-DDTHH';
function getNewImdbInfos() {
    return __awaiter(this, void 0, void 0, function* () {
        const imdbLastCrawlTime = moment().format(imdbLastCrawlTimeFormat);
        const yahooMovies = yield db_1.db.getCollection("yahooMovies");
        const promises = yahooMovies.filter(filterNeedCrawlMovie).map(({ englishTitle, yahooId }) => __awaiter(this, void 0, void 0, function* () {
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
    let now = moment();
    let isRecentMovie = now.diff(moment(releaseDate), 'months') <= 6;
    let hasCrawlNearly = imdbLastCrawlTime && (now.diff(moment(imdbLastCrawlTime, imdbLastCrawlTimeFormat), 'hours') <= 12);
    let shouldCrawl = !hasCrawlNearly && englishTitle && (isRecentMovie || (!isRecentMovie && !imdbLastCrawlTime));
    return shouldCrawl;
}
function removeEmptyInfos(movieInfos) {
    movieInfos.forEach(info => {
        !info.imdbID && delete info.imdbID;
        !info.imdbRating && delete info.imdbRating;
    });
}
function logResult(movieInfos) {
    const foundMovies = movieInfos.filter(movie => movie.imdbID);
    const notfoundMovieIds = movieInfos.filter(movie => !movie.imdbID).map(movie => movie.yahooId);
    console.log(`Found imdbInfos: ${foundMovies.length}, NotFound: ${notfoundMovieIds.length}`);
    console.log(`Not found YahooIds: ${notfoundMovieIds}`);
}
function updateYahooMovies(movieInfos) {
    return movieInfos.map(imdbInfo => db_1.db.updateDocument({ yahooId: imdbInfo.yahooId }, imdbInfo, "yahooMovies"));
}
//# sourceMappingURL=imdbTask.js.map