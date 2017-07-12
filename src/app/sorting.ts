import Movie from '../models/movie';
import * as moment from 'moment';

enum SortType {
    imdb = 0,
    yahoo = 1,
    ptt = 2,
    releaseDate = 3
}

const getSortFunction = (sortType) => {
    let sortFunction;
    switch (sortType) {
        case SortType.imdb:
            sortFunction = getStandardSortFunction('imdbRating');
            break;
        case SortType.ptt:
            sortFunction = (a, b) => getPttRating(b) - getPttRating(a)
            break;
        case SortType.yahoo:
            sortFunction = getStandardSortFunction('yahooRating');
            break;
        case SortType.releaseDate:
            sortFunction = ({ releaseDate: releaseDateA }, { releaseDate: releaseDateB }) => moment(releaseDateB).diff(releaseDateA)
            break;
    }
    return sortFunction;
}

const getStandardSortFunction = (propertyName) => {
    return function (a, b) {
        let aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
        let bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
        return bValue - aValue;
    }
}

const getPttRating = (movie: Movie) => {
    return movie.goodRateArticles.length - movie.badRateArticles.length;
}

export { getSortFunction, SortType }