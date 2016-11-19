import { db } from "../data/db";
import Movie from '../models/movie';
import * as Q from "q";
import * as fetch from "isomorphic-fetch";
import * as moment from 'moment';

const omdbApiUrl = 'http://www.omdbapi.com/';
export function crawlImdb() {
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
                        englishTitle: reason.englishTitle
                    }
                    console.error(reason);
                }
                imdbInfo.imdbLastCrawlTime = moment().format('YYYY-MM-DD');
                imdbInfos.push(imdbInfo);
            });
            console.log(`new imdbInfos count:${imdbInfos.length}`);
            let promises = imdbInfos.map(imdbInfo => db.updateDocument({ englishTitle: imdbInfo.englishTitle }, imdbInfo, "yahooMovies"))
            return Q.all(promises);
        });
}

export function filterNeedCrawlMovie({englishTitle, imdbRating, releaseDate, imdbLastCrawlTime}: Movie) {
    let now = moment();
    let isThisYearMovie = now.diff(moment(releaseDate), 'years') === 0;
    let notYetCrawlToday = now.diff(moment(imdbLastCrawlTime), 'days') > 1;
    return (notYetCrawlToday && englishTitle && (isThisYearMovie || (!isThisYearMovie && !imdbRating)));
}

function getImdbMovieInfo({englishTitle}) {
    return fetch(`${omdbApiUrl}?t=${englishTitle}&tomatoes=true&r=json`)
        .then(res => res.json())
        .then(json => {
            var defer = Q.defer();
            if (json.Response === 'True') {
                let imdbInfo = {
                    englishTitle: englishTitle,
                    imdbID: json.imdbID,
                    imdbRating: json.imdbRating,
                    tomatoRating: json.tomatoRating,
                    tomatoURL: json.tomatoURL
                }
                defer.resolve(imdbInfo);
            } else {
                json.englishTitle = englishTitle;
                defer.reject(json);
            }
            return defer.promise;
        })
}