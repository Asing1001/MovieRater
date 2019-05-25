"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const isValideDate_1 = require("../helper/isValideDate");
function mergeData(yahooMovies, allArticles) {
    let mergedMovies = yahooMovies.map(mergeByChineseTitle);
    return mergedMovies;
    function mergeByChineseTitle(movie) {
        let chineseTitle = movie.chineseTitle;
        let releaseDate = isValideDate_1.default(movie.releaseDate) ? moment(movie.releaseDate) : moment();
        let rangeStart = releaseDate.clone().subtract(3, 'months');
        let rangeEnd = releaseDate.clone().add(6, 'months');
        movie.relatedArticles = allArticles.filter(({ title, date }) => {
            let isChinesetitleMatch = title.indexOf(chineseTitle) !== -1;
            if (isChinesetitleMatch) {
                let articleFullDate = moment(date, 'YYYY/MM/DD');
                let isInNearMonth = articleFullDate.isBetween(rangeStart, rangeEnd);
                return isInNearMonth;
            }
            return isChinesetitleMatch;
        });
        return movie;
    }
}
exports.mergeData = mergeData;
//# sourceMappingURL=mergeData.js.map