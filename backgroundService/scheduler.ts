import {crawlYahooRange} from '../crawler/yahooCrawler';
import {yahooCrawlerSetting} from '../configs/systemSetting';
import {Range,RecurrenceRule,scheduleJob} from 'node-schedule';
import {db} from "../data/db";

export function initScheduler(){
    crawlYahoo();
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

        return crawlYahooRange(startYahooId,endYahooId)
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