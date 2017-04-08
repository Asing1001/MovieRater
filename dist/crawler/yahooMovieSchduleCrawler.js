"use strict";
var Q = require("q");
var fetch = require("isomorphic-fetch");
var cheerio = require("cheerio");
var yahooMovieSchduleUrl = 'https://tw.movies.yahoo.com/movietime_result.html?id=';
function crawlyahooMovieSchdule(yahooId) {
    return fetch("" + (yahooMovieSchduleUrl + yahooId))
        .then(function (res) { return res.text(); })
        .then(function (html) {
        var defer = Q.defer();
        var $ = cheerio.load(html);
        var $items = $('.row-container .item');
        var schedules = Array.from($items).map(function (element) {
            var $ele = $(element);
            var schedule = {
                yahooId: yahooId,
                theaterName: $ele.find('a').text(),
                timesValues: Array.from($ele.find('.tmt')).map(function (time) { return $(time).attr('title'); }),
                timesStrings: Array.from($ele.find('.tmt')).map(function (time) { return $(time).text(); })
            };
            return schedule;
        });
        defer.resolve(schedules);
        return defer.promise;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = crawlyahooMovieSchdule;
//# sourceMappingURL=yahooMovieSchduleCrawler.js.map