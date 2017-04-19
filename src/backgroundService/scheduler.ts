import { crawlYahoo } from '../crawler/yahooCrawler';
import { crawlPtt } from '../crawler/pttCrawler';
import { systemSetting, schedulerSetting } from '../configs/systemSetting';
import * as fetch from "isomorphic-fetch";
import cacheManager from '../data/cacheManager';
import { updateImdbInfo } from '../task/imdbTask';

export function initScheduler() {
    console.log("[initScheduler] Create Schedule for keep website alive.");
    setInterval(function () {
        fetch(systemSetting.websiteUrl).then(res =>
            console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`));
    }, 600000, null);

    console.log("[initScheduler] Create Schedule for yahooCrawler and updateImdbInfo.");
    setInterval(function () {
        console.time('[Scheduler] crawlYahoo');
        crawlYahoo(schedulerSetting.yahooPagePerTime).then(() => {
            console.timeEnd('[Scheduler] crawlYahoo');
            console.time('[Scheduler] updateImdbInfo');
            updateImdbInfo().then(() => {
                console.timeEnd('[Scheduler] updateImdbInfo');
            });
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for pttCrawler.");
    setInterval(function () {
        console.time('[Scheduler] crawlPtt');
        crawlPtt(schedulerSetting.pttPagePerTime).then(() => {
            console.timeEnd('[Scheduler] crawlPtt');
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for cacheManager.init");
    setInterval(function () {
        cacheManager.init();
    }, 86400000, null);

    console.log("[initScheduler] Create Schedule for cacheManager.setInTheaterMoviesCache");
    setInterval(function () {
        cacheManager.setInTheaterMoviesCache();
    }, 3600000, null);
}
