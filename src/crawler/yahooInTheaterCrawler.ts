import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../data/db";
import * as Q from "q";
import YahooMovie from '../models/yahooMovie';

const inTheaterUrl  = 'https://tw.movies.yahoo.com/movie_intheaters.html';
export function crawlInTheater() {
    const defer = Q.defer();
    var req = request({ url: inTheaterUrl, followRedirect: false }, (error, res, body) => {
        if (error) {
            let reason = `error occur when request ${inTheaterUrl}, error:${error}`;
            return defer.reject(reason);
        }

        if (res.headers.location) {
            let reason = `${inTheaterUrl} 404 not found`;
            return defer.reject(reason);
        }

        const $ = cheerio.load(body);
        let yahooIds = $('.group h4>a').map((index,ele)=>$(ele).attr('href').split('id=')[1])
        return defer.resolve(yahooIds);
    })
    return defer.promise;
}