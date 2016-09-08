import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../data/db";
import * as Q from "q";

export interface YahooMovie {
    yahooId: number,
    posterUrl: string,
    chineseTitle: string,
    englishTitle: string,
    releaseDate: string,
    type: string,
    runTime: string,
    director: string,
    actor: string,
    launchCompany: string,
    companyUrl: string,
    sourceUrl: string,
    rating: string
}

export function crawlYahooRange(startId, endId) {
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
            } else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        return yahooMovies;
    });
}


function crawlYahooPage(id: number) {
    const defer = Q.defer();
    const yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + id;
    var req = request({ url: yahooMovieUrl, followRedirect: false }, (error, res, body) => {
        if (error) {
            let reason = `error occur when request ${yahooMovieUrl}, error:${error}`;
            defer.reject(reason);
        }

        if (res.headers.location) {
            let reason = `${yahooMovieUrl} 404 not found`;
            defer.reject(reason);
        }

        const $ = cheerio.load(body);
        const $movieInfoDiv = $('.text.bulletin');
        const $movieInfoValues = $movieInfoDiv.find('p .dta');
        const movieInfo: YahooMovie = {
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
            rating: $('#ymvis em').text()
        };
        defer.resolve(movieInfo);
    })
    return defer.promise;

}