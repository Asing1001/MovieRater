import YahooMovie from './yahooMovie';
import Article from './article';

export default class Movie extends YahooMovie {
    goodRateArticles?: Array<Article>
    normalRateArticles?: Array<Article>
    badRateArticles?: Array<Article>
    otherArticles?: Array<Article>
    imdbID?: string
    imdbRating?: number
    imdbLastCrawlTime ?: string
    tomatoRating?: number
    tomatoURL?: string
}