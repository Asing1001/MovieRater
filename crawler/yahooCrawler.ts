import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../db";
import * as Q from "q";

export interface YahooMovie {
    yahooId: number,
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

export function crawlYahoo() {
    const crawlerStatusFilter = { name: "crawlerStatus" };
    let endYahooId = 6477;
    console.time('crawlYahoo');
    return db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus.hasOwnProperty(endYahooId)) {
            endYahooId = crawlerStatus.endYahooId + 1;
        }
        const promises = [];
        for (let i = endYahooId - 5; i <= endYahooId; i++) {
            const promise = crawlYahooPage(i);
            promises.push(promise);
        }

        return Q.allSettled(promises);
    }).then((results) => {
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
        let movieIds = yahooMovies.map(({yahooId}) => yahooId);
        db.updateDocument(crawlerStatusFilter, { endYahooId: Math.max(...movieIds) }, 'configs');
        console.timeEnd('crawlYahoo');
        console.log(`new movieInfo count:${yahooMovies.length}`);

        let promises = yahooMovies.map(yahooMovie => db.updateDocument({ yahooId: yahooMovie.yahooId }, yahooMovie, "yahooMovies"))
        return Q.all(promises);
    });
}

export function crawlYahooPage(id: number) {
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