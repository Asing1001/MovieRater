"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
var SortType;
(function (SortType) {
    SortType[SortType["imdb"] = 0] = "imdb";
    SortType[SortType["yahoo"] = 1] = "yahoo";
    SortType[SortType["ptt"] = 2] = "ptt";
    SortType[SortType["releaseDate"] = 3] = "releaseDate";
})(SortType || (SortType = {}));
exports.SortType = SortType;
let preSortType;
let preOrder = 1;
const getSortFunction = (sortType) => {
    let order = sortType === preSortType ? preOrder * -1 : 1;
    preOrder = order;
    preSortType = sortType;
    let sortFunction = (a, b) => (getValue(b, sortType) - getValue(a, sortType)) * order;
    return sortFunction;
};
exports.getSortFunction = getSortFunction;
const getValue = (movie, sortType) => {
    switch (sortType) {
        case SortType.imdb:
            return movie.imdbRating === 'N/A' ? 0 : movie.imdbRating;
        case SortType.ptt:
            return movie.goodRateArticles.length - movie.badRateArticles.length;
        case SortType.yahoo:
            return movie.yahooRating === 'N/A' ? 0 : movie.yahooRating;
        case SortType.releaseDate:
            return moment(movie.releaseDate);
    }
};
//# sourceMappingURL=sorting.js.map