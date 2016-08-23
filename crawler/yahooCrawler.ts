import * as request from "request";
import * as cheerio from "cheerio";
import * as express from "express";
// import * as db from "../db";
import {DataAccess, Movie} from "../da";
import * as Q from "q";


export default function crawlYahoo() {
    const promises = [];
    const da = new DataAccess();
    let movieIds = [];
    da.openDbConnection();
    da.getMovies().then(movies=>{
        movieIds =  movies.map((value, index) => value.yahooId)
    });
    console.log(movieIds);

    for (let i = 6000; i <= 6003; i++) {
        const promise = crawlYahooPage(i);
        promises.push(promise);
    }

    Q.all(promises).then(
        (result) => da.insertMovies(result)
    );
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
        console.log(movieInfo);
        defer.resolve(movieInfo);

    })
    return defer.promise;

}