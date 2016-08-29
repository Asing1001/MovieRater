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
    console.time('crawlYahoo');
    return db.getCollection("yahooMovies").then(yahooMovies => {
        let visitedMovieIds: Array<any> = yahooMovies.map(({yahooId}) => yahooId);
        const promises = [];
        for (let i = 6470; i <= 6277; i++) {
            if (visitedMovieIds.indexOf(i) === -1) {
                const promise = crawlYahooPage(i);
                promises.push(promise);
            }
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
                if(reason.statusCode === 404){
                    db.updateDocument({name:'crawlerStatus'},{yahooId:reason.yahooId},'config');
                }
            }
        });
        console.timeEnd('crawlYahoo');
        console.log(`new movieInfo count:${yahooMovies.length}, result:${JSON.stringify(yahooMovies)}`);
        return db.insertCollection(yahooMovies, "yahooMovies");
    });
}

export function crawlYahooPage(id: number) {
    const defer = Q.defer();
    const yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + id;
    var req = request({url:yahooMovieUrl,followRedirect :false}, (error, res, body) => {
        if (error || !body) {
            let reson = {
                message:`error occur when request ${yahooMovieUrl}, error:${error}`,
                statusCode:500,
                yahooId:id
            }
            defer.reject(reson);
        }
        
        if (res.headers.location) {
            let reson = {
                message:`${yahooMovieUrl} 404 not found`,
                statusCode:404,
                yahooId:id
            }
            defer.reject(reson);
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
            rating: $('#yuievtautoid-3 em').text()
        };
        defer.resolve(movieInfo);
    })
    return defer.promise;

}