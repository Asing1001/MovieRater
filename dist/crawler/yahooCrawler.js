"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const cheerio = require("cheerio");
const db_1 = require("../data/db");
const Q = require("q");
function crawlYahoo(howManyPagePerTime) {
    const crawlerStatusFilter = { name: "crawlerStatus" };
    let startYahooId = 1;
    return db_1.db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus && crawlerStatus.maxYahooId) {
            startYahooId = crawlerStatus.maxYahooId + 1;
        }
        return crawlYahooRange(startYahooId, startYahooId + howManyPagePerTime);
    }).then((yahooMovies) => {
        let movieIds = yahooMovies.map(({ yahooId }) => yahooId);
        let newMaxYahooId = Math.max(...movieIds, startYahooId);
        let alreadyCrawlTheNewest = newMaxYahooId === startYahooId;
        if (alreadyCrawlTheNewest) {
            newMaxYahooId = 1;
        }
        db_1.db.updateDocument(crawlerStatusFilter, { maxYahooId: newMaxYahooId }, 'configs');
        console.log(`new movieInfo count:${yahooMovies.length}, newMaxYahooId:${newMaxYahooId}`);
        let promises = yahooMovies.map(yahooMovie => db_1.db.updateDocument({ yahooId: yahooMovie.yahooId }, yahooMovie, "yahooMovies"));
        return Q.all(promises);
    });
}
exports.crawlYahoo = crawlYahoo;
function crawlYahooRange(startId, endId) {
    const promises = [];
    for (let i = startId; i <= endId; i++) {
        const promise = crawlYahooPage(i);
        promises.push(promise);
    }
    return Q.allSettled(promises).then(results => {
        let yahooMovies = [];
        results.forEach((result) => {
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
    const defer = Q.defer();
    const yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + id;
    var req = request({ url: yahooMovieUrl, followRedirect: false }, (error, res, body) => {
        if (error) {
            let reason = `error occur when request ${yahooMovieUrl}, error:${error}`;
            return defer.reject(reason);
        }
        if (res.headers.location) {
            let reason = `${yahooMovieUrl} 404 not found`;
            return defer.reject(reason);
        }
        const $ = cheerio.load(body, { decodeEntities: false });
        const $movieInfoDiv = $('.text.bulletin');
        const $movieInfoValues = $movieInfoDiv.find('p .dta');
        const movieInfo = {
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
            summary: $('.text.full>p').html() || $('.text.show>p').html()
        };
        if (!movieInfo.chineseTitle) {
            let reason = `${yahooMovieUrl} can not find chineseTitle, data might got problem.`;
            return defer.reject(reason);
        }
        return defer.resolve(movieInfo);
    });
    return defer.promise;
}
//# sourceMappingURL=yahooCrawler.js.map