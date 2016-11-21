import { db } from "../data/db";
import YahooMovie from '../models/yahooMovie';
import * as Q from "q";
import cacheManager from '../data/cacheManager';

export function mergeData(yahooMovies: Array<YahooMovie>, pttPages) {
    //merge [[1,2],[3,4]] to [1,2,3,4]
    let allArticles = [].concat(...pttPages.map(({articles}) => articles));
    let mergedMovies = yahooMovies.map(mergeByChineseTitle);
    return mergedMovies;

    function mergeByChineseTitle({chineseTitle, yahooId}:YahooMovie) {
        let relateArticles = allArticles.filter(({title}) => title.indexOf(chineseTitle) !== -1);
        let [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], [], []];
        relateArticles.forEach((article) => {
            let title = article.title;
            if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
                goodRateArticles.push(article);
            } else if (title.indexOf('普雷') !== -1) {
                normalRateArticles.push(article)
            } else if (title.indexOf('負雷') !== -1) {
                badRateArticles.push(article)
            } else {
                otherArticles.push(article);
            }
        });

        return {
            yahooId: yahooId,
            goodRateArticles: goodRateArticles,
            normalRateArticles: normalRateArticles,
            badRateArticles: badRateArticles,
            otherArticles: otherArticles
        };
    }
}

