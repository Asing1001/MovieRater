import * as Q from "q";
import * as fetch from "isomorphic-fetch";
import * as cheerio from "cheerio";
import Movie from '../models/movie';

export async function getIMDBMovieInfo(englishTitle) {
    let imdbID = "";
    let imdbRating = "";
    try {
        imdbID = await getIMDBSuggestId(englishTitle);
        imdbRating = imdbID ? await getIMDBRating(imdbID) : "";
    }
    catch (e) {
        console.error(e);
    }

    return {
        imdbID,
        imdbRating
    };
}

const imdbMobileMovieUrl = 'http://m.imdb.com/title/';
export async function getIMDBRating(imdbID) {
    const response = await fetch(`${imdbMobileMovieUrl + imdbID}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    let rating = "";
    let ratingWrapper = $('#ratings-bar span:nth-child(2)')[0];
    if (ratingWrapper && ratingWrapper.childNodes && ratingWrapper.childNodes[0]) {
        rating = ratingWrapper.childNodes[0].nodeValue;
    }
    return rating;
}

async function getIMDBSuggestId(englishTitle: string) {
    let suggestId = "";
    const imdbSuggestJsonUrl = getIMDBSuggestJsonUrl(englishTitle);
    const response = await fetch(imdbSuggestJsonUrl);
    const text = await response.text();
    const match = /"id":"([\w]*)",/.exec(text);
    if (match) {
        suggestId = match[1];
    } else {
        console.log(`could not find suggest id at ${imdbSuggestJsonUrl}`);
    }
    return suggestId;
}

function getIMDBSuggestJsonUrl(englishTitle: string) {
    const jsonName = englishTitle.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_").substr(0,20);
    return `https://v2.sg.media-imdb.com/suggests/${jsonName.charAt(0)}/${jsonName}.json`
}