import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../db";
import * as Q from "q";
import {yahooCrawlerSetting} from '../configs/systemSetting';

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

export function crawlYahoo() {
    const crawlerStatusFilter = { name: "crawlerStatus" };
    let [maxYahooId,endYahooId] = [6477,6477];
    let startYahooId = endYahooId - 20;
    console.time('crawlYahoo');
    return db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus && crawlerStatus.maxYahooId) {
            endYahooId = crawlerStatus.maxYahooId + 5;
            startYahooId = endYahooId - 20;
        }
        if (yahooCrawlerSetting.enable) {
            startYahooId = yahooCrawlerSetting.startIndex;
            endYahooId = yahooCrawlerSetting.endIndex;
        }

        const promises = [];
        for (let i = startYahooId; i <= endYahooId; i++) {
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
        maxYahooId = Math.max(...movieIds);
        db.updateDocument(crawlerStatusFilter, { maxYahooId: maxYahooId }, 'configs');
        console.timeEnd('crawlYahoo');
        console.log(`new movieInfo count:${yahooMovies.length}, maxYahooId:${maxYahooId}`);

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