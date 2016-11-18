import { db } from "../data/db";
import YahooMovie from '../models/yahooMovie';
import * as Q from "q";

export function mergeData() {
    return Q.spread([db.getCollection("yahooMovies"), db.getCollection("pttPages")], onSpreadFullfilled)
        .then(mergedDatas => {
            let promises = mergedDatas.map(mergedData => db.updateDocument({ chineseTitle: mergedData.chineseTitle }, mergedData, "yahooMovies"))
            return Q.all(promises);
        })
}


function onSpreadFullfilled(yahooMovies: Array<YahooMovie>, pttPages) {
    //merge [[1,2],[3,4]] to [1,2,3,4]
    let allArticles = [].concat(...pttPages.map(({articles}) => articles));
    let mergedMovies = yahooMovies.map(mergeByChineseTitle);
    return mergedMovies;

    function mergeByChineseTitle({chineseTitle}) {
        let relateArticles = allArticles.filter(({title}) => title.indexOf(chineseTitle) !== -1);
        let [noRateArticles, goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], [], []];
        relateArticles.forEach((article) => {
            let title = article.title;
            if (title.indexOf('無雷') !== -1) {
                noRateArticles.push();
            } else if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
                goodRateArticles.push(article);
            } else if (title.indexOf('普雷') !== -1) {
                normalRateArticles.push(article)
            } else if (title.indexOf('負雷') !== -1) {
                badRateArticles.push(article)
            }
        });

        return {
            noRateArticles: noRateArticles,
            goodRateArticles: goodRateArticles,
            normalRateArticles: normalRateArticles,
            badRateArticles: badRateArticles,
            chineseTitle: chineseTitle,
            otherArticles: otherArticles
        };
    }
}

