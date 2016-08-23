import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../db";
import * as Q from "q";


export default function crawlYahoo() {
    const promises = [];
    db.getCollection("movies").then(movies => {
        let movieIds: Array<any> = movies.map((value, index) => value.yahooId)
        for (let i = 6000; i <= 6009; i++) {
            if (movieIds.indexOf(i) === -1) {
                const promise = crawlYahooPage(i);
                promises.push(promise);
            }
        }

        Q.all(promises).then(
            (result) => {
                db.insertCollection(result, "movies")
                console.log(`new movieInfo count:${result.length}, result:${JSON.stringify(result)}`);
            }
        );
    });
}

function crawlYahooPage(id: number) {
    const defer = Q.defer();
    const yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + id;
    request(yahooMovieUrl, (error, r, html: string) => {
        if (error || !html) {
            return;
        }

        const $ = cheerio.load(html);
        const $movieInfoDiv = $('.text.bulletin');
        const $movieInfoValues = $movieInfoDiv.find('p .dta');
        const movieInfo = {
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

        };
        defer.resolve(movieInfo);
    })
    return defer.promise;

}