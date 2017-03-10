"use strict";
var request = require("request");
var cheerio = require("cheerio");
var Q = require("q");
var inTheaterUrl = 'https://tw.movies.yahoo.com/';
function crawlInTheater() {
    var defer = Q.defer();
    var req = request({ url: inTheaterUrl, followRedirect: false }, function (error, res, body) {
        if (error) {
            var reason = "error occur when request " + inTheaterUrl + ", error:" + error;
            return defer.reject(reason);
        }
        if (res.headers.location) {
            var reason = inTheaterUrl + " 404 not found";
            return defer.reject(reason);
        }
        var $ = cheerio.load(body);
        var yahooIds = Array.from($('select.auto[name="id"]').find('option[value!=""]').map(function (index, ele) { return parseInt($(ele).val()); }));
        return defer.resolve(yahooIds);
    });
    return defer.promise;
}
exports.crawlInTheater = crawlInTheater;
//# sourceMappingURL=yahooInTheaterCrawler.js.map