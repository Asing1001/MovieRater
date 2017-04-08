"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Q = require("q");
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const imdbMobileMovieUrl = 'http://m.imdb.com/title/';
function crawlImdb(id) {
    return fetch(`${imdbMobileMovieUrl + id}`)
        .then(res => { return res.text(); })
        .then(html => {
        var defer = Q.defer();
        const $ = cheerio.load(html);
        let rating = "";
        let ratingWrapper = $('#ratings-bar span:nth-child(2)')[0];
        if (ratingWrapper && ratingWrapper.childNodes && ratingWrapper.childNodes[0]) {
            rating = ratingWrapper.childNodes[0].nodeValue;
        }
        defer.resolve(rating);
        return defer.promise;
    });
}
exports.default = crawlImdb;
//# sourceMappingURL=imdbCrawler.js.map