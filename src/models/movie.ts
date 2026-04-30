import MovieBase from './movieBase';
import Article from './article';
import Schedule from './schedule';

export default class Movie extends MovieBase {
  movieBaseId?: string;
  goodRateArticles?: Array<Article>;
  normalRateArticles?: Array<Article>;
  badRateArticles?: Array<Article>;
  otherArticles?: Array<Article>;
  relatedArticles?: Array<Article>;
  pttGoodCount?: number;
  pttNormalCount?: number;
  pttBadCount?: number;
  imdbID?: string;
  imdbRating?: string;
  imdbLastCrawlTime?: string;
  tomatoRating?: string;
  tomatoURL?: string;
  briefSummary?: string;
  schedules?: Schedule[];
}
