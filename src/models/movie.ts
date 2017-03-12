import YahooMovie from './yahooMovie';
import Article from './article';

export default class Movie extends YahooMovie {
    goodRateArticles?: Array<Article>
    normalRateArticles?: Array<Article>
    badRateArticles?: Array<Article>
    otherArticles?: Array<Article>
    relatedArticles?: Array<Article>
    imdbID?: string
    imdbRating?: string
    imdbLastCrawlTime ?: string
    tomatoRating?: string
    tomatoURL?: string
    briefSummary?: string
}