import { crawlYahooRange } from '../crawler/yahooCrawler';
import { crawlImdb } from '../crawler/imdbCrawler';
import { crawlPtt } from '../crawler/pttCrawler';
import { mergeData } from '../crawler/mergeData';
import { yahooCrawlerSetting, systemSetting } from '../configs/systemSetting';
import * as fetch from "isomorphic-fetch";
import { db } from "../data/db";
import * as Q from 'q';

export function initScheduler() {

    console.log("[initScheduler] Create Schedule for keep website alive.");
    setInterval(function () {
        fetch(systemSetting.websiteUrl).then(res =>
            console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`))
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for yahooCrawler and crawlImdb.");
    setInterval(function () {
        crawlYahoo().then(() => {
            console.log("[Scheduler] crawlYahoo success.");
            crawlImdb().then(() =>
                console.log("[Scheduler] crawlImdb success."));
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for pttCrawler and mergeData.");
    setInterval(function () {
        crawlPtt().then(() => {
            console.log("[Scheduler] crawlPtt success.");
            mergeData().then(() =>
                console.log("[Scheduler] mergeData success."))
        });
    }, 900000, null);

}


function crawlYahoo() {
    const crawlerStatusFilter = { name: "crawlerStatus" };
    let [maxYahooId, endYahooId] = [6477, 6477];
    let startYahooId = endYahooId - 20;
    console.time('crawlYahoo');
    return db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus && crawlerStatus.maxYahooId) {
            endYahooId = crawlerStatus.maxYahooId + 5;
            startYahooId = endYahooId - 20;
        }
        if (yahooCrawlerSetting.enable) {
            startYahooId = yahooCrawlerSetting.startIndex;
            endYahooId = yahooCrawlerSetting.endIndex;
        }

        return crawlYahooRange(startYahooId, endYahooId)
    }).then((yahooMovies) => {
        let movieIds = yahooMovies.map(({yahooId}) => yahooId);
        maxYahooId = Math.max(...movieIds);
        db.updateDocument(crawlerStatusFilter, { maxYahooId: maxYahooId }, 'configs');
        console.timeEnd('crawlYahoo');
        console.log(`new movieInfo count:${yahooMovies.length}, maxYahooId:${maxYahooId}`);
        let promises = yahooMovies.map(yahooMovie => db.updateDocument({ yahooId: yahooMovie.yahooId }, yahooMovie, "yahooMovies"))
        return Q.all(promises);
    });
}