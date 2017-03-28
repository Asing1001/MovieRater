import { db } from "../data/db";
import Movie from '../models/movie';
import * as Q from "q";
import * as fetch from "isomorphic-fetch";
import * as moment from 'moment';
import crawlImdb from './imdbCrawler';


const omdbApiUrl = 'http://www.omdbapi.com/';
export function crawlOmdb() {
    return db.getCollection("yahooMovies").then((yahooMovies: Array<Movie>) => {
        return yahooMovies.filter(filterNeedCrawlMovie).map(getImdbMovieInfo);
    })
        .then(promises => Q.allSettled(promises))
        .then(results => {
            let imdbInfos = [];
            results.forEach((result) => {
                let imdbInfo;
                if (result.state === "fulfilled") {
                    imdbInfo = result.value;
                } else {
                    var reason = result.reason;
                    imdbInfo = {
                        yahooId: reason.yahooId
                    }
                    console.error(reason);
                }
                imdbInfo.imdbLastCrawlTime = moment().format('YYYY-MM-DD');
                imdbInfos.push(imdbInfo);
            });
            console.log(`new imdbInfos count:${imdbInfos.length}`);
            let promises = imdbInfos.map(imdbInfo => db.updateDocument({ yahooId: imdbInfo.yahooId }, imdbInfo, "yahooMovies"))
            return Q.all(promises);
        });
}

export function filterNeedCrawlMovie({englishTitle, imdbRating, releaseDate, imdbLastCrawlTime}: Movie) {
    let now = moment();
    let isRecentMovie = now.diff(moment(releaseDate), 'months') <= 6;
    let hasCrawlToday = imdbLastCrawlTime && (now.diff(moment(imdbLastCrawlTime), 'days') === 0);
    let shouldCrawl = !hasCrawlToday && englishTitle && (isRecentMovie || (!isRecentMovie && !imdbLastCrawlTime));
    return shouldCrawl;
}

function getImdbMovieInfo({englishTitle, yahooId}: Movie) {
    return fetch(`${omdbApiUrl}?t=${encodeURIComponent(englishTitle)}&tomatoes=true&r=json`)
        .then(res => { return res.json() })
        .then((json:any) => {
            var defer = Q.defer();
            if (json.Response === 'True') {
                crawlImdb(json.imdbID).then(
                    (rating) => {
                        let imdbInfo = {
                            yahooId: yahooId,
                            imdbID: json.imdbID,
                            imdbRating: rating,
                            tomatoRating: json.tomatoRating,
                            tomatoURL: json.tomatoURL
                        }
                        defer.resolve(imdbInfo);
                    }
                )
            } else {
                json.yahooId = yahooId;
                defer.reject(json);
            }
            return defer.promise;
        })
}