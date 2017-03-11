"use strict";
var request = require("request");
var cheerio = require("cheerio");
var db_1 = require("../data/db");
var Q = require("q");
var systemSetting_1 = require('../configs/systemSetting');
function crawlYahoo() {
    var crawlerStatusFilter = { name: "crawlerStatus" };
    var howManyPagePerTime = 50;
    var startYahooId = 1;
    return db_1.db.getDocument(crawlerStatusFilter, "configs").then(function (crawlerStatus) {
        if (crawlerStatus && crawlerStatus.maxYahooId) {
            startYahooId = crawlerStatus.maxYahooId + 1;
        }
        if (systemSetting_1.yahooCrawlerSetting.enable) {
            startYahooId = systemSetting_1.yahooCrawlerSetting.startYahooId;
            howManyPagePerTime = systemSetting_1.yahooCrawlerSetting.howManyPagePerTime;
        }
        return crawlYahooRange(startYahooId, startYahooId + howManyPagePerTime);
    }).then(function (yahooMovies) {
        var movieIds = yahooMovies.map(function (_a) {
            var yahooId = _a.yahooId;
            return yahooId;
        });
        var newMaxYahooId = Math.max.apply(Math, movieIds.concat([startYahooId]));
        var alreadyCrawlTheNewest = newMaxYahooId === startYahooId;
        if (alreadyCrawlTheNewest) {
            newMaxYahooId = 1;
        }
        db_1.db.updateDocument(crawlerStatusFilter, { maxYahooId: newMaxYahooId }, 'configs');
        console.log("new movieInfo count:" + yahooMovies.length + ", newMaxYahooId:" + newMaxYahooId);
        var promises = yahooMovies.map(function (yahooMovie) { return db_1.db.updateDocument({ yahooId: yahooMovie.yahooId }, yahooMovie, "yahooMovies"); });
        return Q.all(promises);
    });
}
exports.crawlYahoo = crawlYahoo;
function crawlYahooRange(startId, endId) {
    var promises = [];
    for (var i = startId; i <= endId; i++) {
        var promise = crawlYahooPage(i);
        promises.push(promise);
    }
    return Q.allSettled(promises).then(function (results) {
        var yahooMovies = [];
        results.forEach(function (result) {
            if (result.state === "fulfilled") {
                var value = result.value;
                yahooMovies.push(value);
            }
            else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        return yahooMovies;
    });
}
exports.crawlYahooRange = crawlYahooRange;
function crawlYahooPage(id) {
    var defer = Q.defer();
    var yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + id;
    var req = request({ url: yahooMovieUrl, followRedirect: false }, function (error, res, body) {
        if (error) {
            var reason = "error occur when request " + yahooMovieUrl + ", error:" + error;
            return defer.reject(reason);
        }
        if (res.headers.location) {
            var reason = yahooMovieUrl + " 404 not found";
            return defer.reject(reason);
        }
        var $ = cheerio.load(body);
        var $movieInfoDiv = $('.text.bulletin');
        var $movieInfoValues = $movieInfoDiv.find('p .dta');
        var movieInfo = {
            yahooId: id,
            posterUrl: $('#ymvmvf').find('.img a').attr('href'),
            chineseTitle: $movieInfoDiv.find('h4').text(),
            englishTitle: $movieInfoDiv.find('h5').text(),
            releaseDate: $movieInfoValues.eq(0).text(),
            type: $movieInfoValues.eq(1).find('a').text(),
            runTime: $movieInfoValues.eq(2).text(),
            director: $movieInfoValues.eq(3).find('a').text(),
            actor: $movieInfoValues.eq(4).text(),
            launchCompany: $movieInfoValues.eq(5).text(),
            companyUrl: $movieInfoValues.eq(3).find('a').attr('href'),
            sourceUrl: yahooMovieUrl,
            yahooRating: $('#ymvis em').text(),
            summary: $('.text.full>p').html()
        };
        if (!movieInfo.chineseTitle) {
            var reason = yahooMovieUrl + " can not find chineseTitle, data might got problem.";
            return defer.reject(reason);
        }
        return defer.resolve(movieInfo);
    });
    return defer.promise;
}
//# sourceMappingURL=yahooCrawler.js.map