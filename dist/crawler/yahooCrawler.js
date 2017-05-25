"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const cheerio = require("cheerio");
const Q = require("q");
function getYahooMovieInfo(yahooId) {
    const defer = Q.defer();
    const yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + yahooId;
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
            yahooId,
            posterUrl: $('#ymvmvf').find('.img a').attr('href').split('*')[1],
            chineseTitle: $movieInfoDiv.find('h4').text(),
            englishTitle: $movieInfoDiv.find('h5').text(),
            releaseDate: $movieInfoValues.eq(0).text(),
            type: $movieInfoValues.eq(1).find('a').text(),
            runTime: $movieInfoValues.eq(2).text(),
            director: $movieInfoValues.eq(3).find('a').text(),
            actor: $movieInfoValues.eq(4).text(),
            launchCompany: $movieInfoValues.eq(5).text(),
            companyUrl: $movieInfoValues.eq(3).find('a').attr('href'),
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
exports.getYahooMovieInfo = getYahooMovieInfo;
//# sourceMappingURL=yahooCrawler.js.map