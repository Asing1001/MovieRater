import {db} from "../data/db";
import YahooMovie from '../models/YahooMovie';
import * as Q from "q";
import * as fetch from "isomorphic-fetch";

const omdbApiUrl = 'http://www.omdbapi.com/';
export function crawlImdb() {
    return db.getCollection("yahooMovies").then(yahooMovies => {
        return yahooMovies.filter(({englishTitle}) => englishTitle !== '').map(getImdbMovieInfo);
    })
        .then(promises => Q.allSettled(promises))
        .then(results => {
            let imdbInfos = [];
            results.forEach((result) => {
                if (result.state === "fulfilled") {
                    var value = result.value;
                    imdbInfos.push(value);
                } else {
                    var reason = result.reason;
                    console.error(reason);
                }
            });
            console.log(`new imdbInfos count:${imdbInfos.length}`);
            let promises = imdbInfos.map(imdbInfo => db.updateDocument({ englishTitle: imdbInfo.englishTitle }, imdbInfo, "yahooMovies"))
            return Q.all(promises);
        });
}

function getImdbMovieInfo({englishTitle}) {
    return fetch(`${omdbApiUrl}?t=${englishTitle}&tomatoes=true&r=json`)
        .then(res => res.json())
        .then(json=>{
            var defer = Q.defer();
            if(json.Response==='True'){
                let imdbInfos = {
                    englishTitle:englishTitle,
                    imdbID:json.imdbID,
                    imdbRating:json.imdbRating,
                    tomatoRating:json.tomatoRating,
                    tomatoURL:json.tomatoURL
                }  
                defer.resolve(imdbInfos);
            }else{
                defer.reject(json);
            }
            return defer.promise;
        })
}