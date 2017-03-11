import { db } from "../data/db";
import Movie from '../models/movie';
import * as Q from "q";
import * as fetch from "isomorphic-fetch";
import * as moment from 'moment';
import * as cheerio from "cheerio";


const imdbMovieUrl = 'http://www.imdb.com/title/';
export default function crawlImdb(id) {
    return fetch(`${imdbMovieUrl + id}`)
        .then(res => { return res.text() })
        .then(html => {
            var defer = Q.defer();
            const $ = cheerio.load(html);
            let rating = $('[itemprop="ratingValue"]').text();
            defer.resolve(rating);
            return defer.promise;
        })
}