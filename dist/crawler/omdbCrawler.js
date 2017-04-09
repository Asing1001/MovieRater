"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../data/db");
const Q = require("q");
const fetch = require("isomorphic-fetch");
const moment = require("moment");
const imdbCrawler_1 = require("./imdbCrawler");
const omdbApiUrl = 'http://www.omdbapi.com/';
function crawlOmdb() {
    return db_1.db.getCollection("yahooMovies").then((yahooMovies) => {
        return yahooMovies.filter(filterNeedCrawlMovie).map(getImdbMovieInfo);
    })
        .then(promises => Q.allSettled(promises))
        .then(results => {
        let imdbInfos = [];
        results.forEach((result) => {
            let imdbInfo;
            if (result.state === "fulfilled") {
                imdbInfo = result.value;
            }
            else {
                var reason = result.reason;
                imdbInfo = {
                    yahooId: reason.yahooId
                };
                console.error(reason);
            }
            imdbInfo.imdbLastCrawlTime = moment().format('YYYY-MM-DD');
            imdbInfos.push(imdbInfo);
        });
        console.log(`new imdbInfos count:${imdbInfos.length}`);
        let promises = imdbInfos.map(imdbInfo => db_1.db.updateDocument({ yahooId: imdbInfo.yahooId }, imdbInfo, "yahooMovies"));
        return Q.all(promises);
    });
}
exports.crawlOmdb = crawlOmdb;
function filterNeedCrawlMovie({ englishTitle, imdbRating, releaseDate, imdbLastCrawlTime }) {
    let now = moment();
    let isRecentMovie = now.diff(moment(releaseDate), 'months') <= 6;
    let hasCrawlToday = imdbLastCrawlTime && (now.diff(moment(imdbLastCrawlTime), 'days') === 0);
    let shouldCrawl = !hasCrawlToday && englishTitle && (isRecentMovie || (!isRecentMovie && !imdbLastCrawlTime));
    return shouldCrawl;
}
exports.filterNeedCrawlMovie = filterNeedCrawlMovie;
function getImdbMovieInfo({ englishTitle, yahooId }) {
    return fetch(`${omdbApiUrl}?t=${encodeURIComponent(englishTitle)}&tomatoes=true&r=json`)
        .then(res => { return res.json(); })
        .then((json) => {
        var defer = Q.defer();
        if (json.Response === 'True') {
            imdbCrawler_1.getIMDBRating(json.imdbID).then((rating) => {
                let imdbInfo = {
                    yahooId: yahooId,
                    imdbID: json.imdbID,
                    imdbRating: rating,
                    tomatoRating: json.tomatoRating,
                    tomatoURL: json.tomatoURL
                };
                defer.resolve(imdbInfo);
            });
        }
        else {
            json.yahooId = yahooId;
            defer.reject(json);
        }
        return defer.promise;
    });
}
//# sourceMappingURL=omdbCrawler.js.map