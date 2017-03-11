"use strict";
var Q = require("q");
var fetch = require("isomorphic-fetch");
var cheerio = require("cheerio");
var imdbMobileMovieUrl = 'http://m.imdb.com/title/';
function crawlImdb(id) {
    return fetch("" + (imdbMobileMovieUrl + id))
        .then(function (res) { return res.text(); })
        .then(function (html) {
        var defer = Q.defer();
        var $ = cheerio.load(html);
        var rating = "";
        var ratingWrapper = $('#ratings-bar span:nth-child(2)')[0];
        if (ratingWrapper && ratingWrapper.childNodes && ratingWrapper.childNodes[0]) {
            rating = ratingWrapper.childNodes[0].nodeValue;
        }
        defer.resolve(rating);
        return defer.promise;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = crawlImdb;
//# sourceMappingURL=imdbCrawler.js.map