"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Q = require("q");
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const yahooMovieSchduleUrl = 'https://tw.movies.yahoo.com/movietime_result.html?id=';
function crawlyahooMovieSchdule(yahooId) {
    return fetch(`${yahooMovieSchduleUrl + yahooId}`)
        .then(res => { return res.text(); })
        .then(html => {
        const defer = Q.defer();
        const $ = cheerio.load(html);
        let $items = $('.row-container .item');
        let schedules = Array.from($items).map(element => {
            let $ele = $(element);
            let schedule = {
                yahooId: yahooId,
                theaterName: $ele.find('a').text(),
                timesValues: Array.from($ele.find('.tmt')).map((time) => $(time).attr('title')),
                timesStrings: Array.from($ele.find('.tmt')).map((time) => $(time).text())
            };
            return schedule;
        });
        defer.resolve(schedules);
        return defer.promise;
    });
}
exports.default = crawlyahooMovieSchdule;
//# sourceMappingURL=yahooMovieSchduleCrawler.js.map