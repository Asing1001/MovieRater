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

const regexp = /"id":"([\w]*)",/;
const imdbJsonUrl = "https://v2.sg.media-imdb.com/suggests/w/who_killed_cock_robi.json";
async function getIMDBSuggestId(englishTitle: string) {
    const response = await fetch(`https://v2.sg.media-imdb.com/suggests/${englishTitle.trim().charAt(0).toLowerCase()}/${encodeURIComponent(englishTitle)}.json`);
    const text = await response.text();
    const match = regexp.exec(text);
    return match ? match[1] : "";
}