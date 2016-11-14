import YahooMovie from '../models/YahooMovie';
import Article from './article';

export default class Movie extends YahooMovie {
    relateArticles: Article
    goodRateCount: number
    normalRateCount: number
    badRateCount: number
    imdbID: string
    imdbRating: number
    tomatoRating: number
    tomatoURL: string
}