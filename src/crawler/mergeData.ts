import {db} from "../data/db";
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
    let mergedDatas = yahooMovies.filter(filterBySomething).map(mergeByChineseTitle);
    return mergedDatas;

    function filterBySomething(yahooMovie) {
        //TODO 可在此決定哪些不要再update了
        return true;
    }

    function mergeByChineseTitle({chineseTitle}) {
        //TODO 用模糊比對取代indexOf資料會比較多
        let relateArticles = allArticles.filter(({title}) => title.indexOf(chineseTitle) !== -1);
        let [goodRateCount, normalRateCount, badRateCount] = [0,0,0];
        relateArticles.forEach(({title}) => {
            if (title.indexOf('好雷') !== -1) goodRateCount++;
            if (title.indexOf('普雷') !== -1) normalRateCount++;
            if (title.indexOf('負雷') !== -1) badRateCount++;
        });

        return {
            goodRateCount: goodRateCount,
            normalRateCount: normalRateCount,
            badRateCount: badRateCount,
            chineseTitle: chineseTitle,
            relateArticles: relateArticles
        };
    }
}

