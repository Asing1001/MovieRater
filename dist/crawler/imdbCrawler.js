"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
function getIMDBMovieInfo(englishTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        let imdbID = "";
        let imdbRating = "";
        try {
            imdbID = yield getIMDBSuggestId(englishTitle);
            imdbRating = imdbID ? yield getIMDBRating(imdbID) : "";
        }
        catch (e) {
            console.error(e);
        }
        return {
            imdbID,
            imdbRating
        };
    });
}
exports.getIMDBMovieInfo = getIMDBMovieInfo;
const imdbMobileMovieUrl = 'http://m.imdb.com/title/';
function getIMDBRating(imdbID) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${imdbMobileMovieUrl + imdbID}`);
        const html = yield response.text();
        const $ = cheerio.load(html);
        let rating = "";
        let ratingWrapper = $('#ratings-bar span:nth-child(2)')[0];
        if (ratingWrapper && ratingWrapper.childNodes && ratingWrapper.childNodes[0]) {
            rating = ratingWrapper.childNodes[0].nodeValue;
        }
        return rating;
    });
}
exports.getIMDBRating = getIMDBRating;
const regexp = /"id":"([\w]*)",/;
const imdbJsonUrl = "https://v2.sg.media-imdb.com/suggests/w/who_killed_cock_robi.json";
function getIMDBSuggestId(englishTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://v2.sg.media-imdb.com/suggests/${englishTitle.trim().charAt(0).toLowerCase()}/${encodeURIComponent(englishTitle)}.json`);
        const text = yield response.text();
        const match = regexp.exec(text);
        return match ? match[1] : "";
    });
}
//# sourceMappingURL=imdbCrawler.js.map