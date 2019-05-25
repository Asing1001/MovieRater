import YahooMovie from '../models/yahooMovie';
import Movie from '../models/movie';
import Article from '../models/article';
import * as moment from 'moment';
import isValideDate from '../helper/isValideDate';

export function mergeData(yahooMovies: Array<YahooMovie>, allArticles: Article[]) {
    let mergedMovies = yahooMovies.map(mergeByChineseTitle);
    return mergedMovies;

    function mergeByChineseTitle(movie: Movie) {
        let chineseTitle = movie.chineseTitle;
        let releaseDate = isValideDate(movie.releaseDate)? moment(movie.releaseDate): moment();
        let rangeStart = releaseDate.clone().subtract(3, 'months');
        let rangeEnd = releaseDate.clone().add(6, 'months');

        movie.relatedArticles = allArticles.filter(({title, date}: Article) => {
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


