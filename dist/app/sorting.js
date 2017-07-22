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
const getSortFunction = (sortType) => {
    let sortFunction;
    switch (sortType) {
        case SortType.imdb:
            sortFunction = getStandardSortFunction('imdbRating');
            break;
        case SortType.ptt:
            sortFunction = (a, b) => getPttRating(b) - getPttRating(a);
            break;
        case SortType.yahoo:
            sortFunction = getStandardSortFunction('yahooRating');
            break;
        case SortType.releaseDate:
            sortFunction = ({ releaseDate: releaseDateA }, { releaseDate: releaseDateB }) => moment(releaseDateB).diff(releaseDateA);
            break;
    }
    return sortFunction;
};
exports.getSortFunction = getSortFunction;
const getStandardSortFunction = (propertyName) => {
    return function (a, b) {
        let aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
        let bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
        return bValue - aValue;
    };
};
const getPttRating = (movie) => {
    return movie.goodRateArticles.length - movie.badRateArticles.length;
};
//# sourceMappingURL=sorting.js.map