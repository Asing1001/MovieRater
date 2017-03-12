"use strict";
var moment = require('moment');
function mergeData(yahooMovies, pttPages) {
    //merge [[1,2],[3,4]] to [1,2,3,4]
    var allArticles = (_a = []).concat.apply(_a, pttPages.map(function (_a) {
        var articles = _a.articles;
        return articles;
    }));
    var mergedMovies = yahooMovies.map(mergeByChineseTitle);
    return mergedMovies;
    function mergeByChineseTitle(movie) {
        var chineseTitle = movie.chineseTitle;
        var releaseDate = moment(movie.releaseDate);
        var releaseYear = releaseDate.year();
        var rangeStart = releaseDate.clone().subtract(3, 'months');
        var rangeEnd = releaseDate.clone().add(6, 'months');
        movie.relatedArticles = allArticles.filter(function (_a) {
            var title = _a.title, date = _a.date;
            var isChinesetitleMatch = title.indexOf(chineseTitle) !== -1;
            if (isChinesetitleMatch) {
                var articleFullDate = moment(date, 'YYYY/MM/DD');
                var isInNearMonth = articleFullDate.isBetween(rangeStart, rangeEnd);
                return isInNearMonth;
            }
            return isChinesetitleMatch;
        });
        return movie;
    }
    var _a;
}
exports.mergeData = mergeData;
//# sourceMappingURL=mergeData.js.map