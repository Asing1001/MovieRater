"use strict";
var db_1 = require("../data/db");
var Q = require("q");
var fetch = require("isomorphic-fetch");
var moment = require('moment');
var omdbApiUrl = 'http://www.omdbapi.com/';
function crawlImdb() {
    return db_1.db.getCollection("yahooMovies").then(function (yahooMovies) {
        return yahooMovies.filter(filterNeedCrawlMovie).map(getImdbMovieInfo);
    })
        .then(function (promises) { return Q.allSettled(promises); })
        .then(function (results) {
        var imdbInfos = [];
        results.forEach(function (result) {
            var imdbInfo;
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
        console.log("new imdbInfos count:" + imdbInfos.length);
        var promises = imdbInfos.map(function (imdbInfo) { return db_1.db.updateDocument({ yahooId: imdbInfo.yahooId }, imdbInfo, "yahooMovies"); });
        return Q.all(promises);
    });
}
exports.crawlImdb = crawlImdb;
function filterNeedCrawlMovie(_a) {
    var englishTitle = _a.englishTitle, imdbRating = _a.imdbRating, releaseDate = _a.releaseDate, imdbLastCrawlTime = _a.imdbLastCrawlTime;
    var now = moment();
    var isThisYearMovie = now.diff(moment(releaseDate), 'years') === 0;
    var hasCrawlToday = imdbLastCrawlTime && (now.diff(moment(imdbLastCrawlTime), 'days') === 0);
    var shouldCrawl = !hasCrawlToday && englishTitle && (isThisYearMovie || (!isThisYearMovie && !imdbLastCrawlTime));
    return shouldCrawl;
}
exports.filterNeedCrawlMovie = filterNeedCrawlMovie;
function getImdbMovieInfo(_a) {
    var englishTitle = _a.englishTitle, yahooId = _a.yahooId, releaseDate = _a.releaseDate;
    return fetch(omdbApiUrl + "?t=" + encodeURIComponent(englishTitle) + "&y=" + releaseDate.substr(0, 4) + "&tomatoes=true&r=json")
        .then(function (res) { return res.json(); })
        .then(function (json) {
        var defer = Q.defer();
        if (json.Response === 'True') {
            var imdbInfo = {
                yahooId: yahooId,
                imdbID: json.imdbID,
                imdbRating: json.imdbRating,
                tomatoRating: json.tomatoRating,
                tomatoURL: json.tomatoURL
            };
            defer.resolve(imdbInfo);
        }
        else {
            json.yahooId = yahooId;
            defer.reject(json);
        }
        return defer.promise;
    });
}
//# sourceMappingURL=imdbCrawler.js.map