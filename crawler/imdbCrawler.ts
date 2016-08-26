import {db} from "../db";
import {YahooMovie} from "./yahooCrawler";
import * as fetch from "node-fetch";
import * as Q from "q";
const omdbApiUrl = 'http://www.omdbapi.com/';
export function crawlImdb() {
    db.getCollection("yahooMovies").then(yahooMovies => {
        return yahooMovies.filter(({englishTitle}) => englishTitle !== '').map(getImdbMovieInfo);
    })
        .then(promises => Q.all(promises))
        .then(result => {
            db.insertCollection(result, "imdbMovies")
            console.log(`new imdbMovies count:${result.length}, result:${JSON.stringify(result)}`);
        });
}

function getImdbMovieInfo({englishTitle}) {
    return fetch(`${omdbApiUrl}?t=${englishTitle}&tomatoes=true&r=json`)
        .then(res => res.json())
}