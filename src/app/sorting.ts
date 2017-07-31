import Movie from '../models/movie';
import * as moment from 'moment';

enum SortType {
    imdb = 0,
    yahoo = 1,
    ptt = 2,
    releaseDate = 3
}

let preSortType;
let preOrder = 1;
const getSortFunction = (sortType) => {
    let order = sortType === preSortType ? preOrder * -1 : 1;
    preOrder = order;
    preSortType = sortType;
    let sortFunction = (a, b) => (getValue(b, sortType) - getValue(a, sortType)) * order;
    return sortFunction;
}

const getValue = (movie, sortType) => {
    switch (sortType) {
        case SortType.imdb:
            return movie.imdbRating === 'N/A' ? 0 : movie.imdbRating;
        case SortType.ptt:
            return movie.goodRateArticles.length - movie.badRateArticles.length
        case SortType.yahoo:
            return movie.yahooRating === 'N/A' ? 0 : movie.yahooRating;
        case SortType.releaseDate:
            return moment(movie.releaseDate)
    }
}

export { getSortFunction, SortType }