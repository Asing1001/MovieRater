import { db } from "../data/db";
import Movie from '../models/movie';
import Article from '../models/article';
import * as Q from "q";
import cacheManager from '../data/cacheManager';

export function mergeData(movies: Array<Movie>, pttPages) {
    //merge [[1,2],[3,4]] to [1,2,3,4]
    let mergedMovies = [];
    let pttArticles = [].concat(...pttPages.map(({articles}) => articles));
    movies.forEach(mergeByChineseTitle);
    return mergedMovies;

    function mergeByChineseTitle({chineseTitle, yahooId, relatedArticles}: Movie) {
        let needUpdate = false;
        relatedArticles = relatedArticles || [];
        let relatedArticlesUrl = relatedArticles.map(({url}) => url);
        pttArticles.forEach((article: Article) => {
            let notInRelatedArticles = relatedArticlesUrl.indexOf(article.url) === -1;
            if (notInRelatedArticles) {
                needUpdate = true;
                relatedArticles.push(article);
            };
        });

        if (needUpdate) {
            mergedMovies.push({
                yahooId: yahooId,
                relatedArticles: relatedArticles
            });
        }
    }
}

