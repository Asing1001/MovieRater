import * as Q from "q";
import * as fetch from "isomorphic-fetch";
import * as cheerio from "cheerio";

const imdbMobileMovieUrl = 'http://m.imdb.com/title/';
export default function crawlImdb(id) {
    return fetch(`${imdbMobileMovieUrl + id}`)
        .then(res => { return res.text() })
        .then(html => {
            var defer = Q.defer();
            const $ = cheerio.load(html);
            let rating = "";
            let ratingWrapper = $('#ratings-bar span:nth-child(2)')[0];
            if (ratingWrapper && ratingWrapper.childNodes && ratingWrapper.childNodes[0]) {
                rating = ratingWrapper.childNodes[0].nodeValue;
            }
            defer.resolve(rating);
            return defer.promise;
        })
}