import { updateYahooMovies, updateTheaterWithLocationList } from '../task/yahooTask';
import { crawlPtt } from '../crawler/pttCrawler';
import { systemSetting, schedulerSetting } from '../configs/systemSetting';
import * as fetch from "isomorphic-fetch";
import cacheManager from '../data/cacheManager';
import { updateImdbInfo } from '../task/imdbTask';

export function initScheduler() {
    console.log("[initScheduler]");
    setInterval(function () {
        fetch(systemSetting.websiteUrl).then(res =>
            console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`));
    }, 600000, null);

    setInterval(async function () {
        console.time('[Scheduler] crawlYahoo');
        await updateYahooMovies(schedulerSetting.yahooPagePerTime)
        console.timeEnd('[Scheduler] crawlYahoo');
        console.time('[Scheduler] updateImdbInfo');
        await updateImdbInfo()
        console.timeEnd('[Scheduler] updateImdbInfo');
    }, 900000, null);

    setInterval(function () {
        console.time('[Scheduler] crawlPtt');
        crawlPtt(schedulerSetting.pttPagePerTime).then(() => {
            console.timeEnd('[Scheduler] crawlPtt');
        });
    }, 900000, null);

    setInterval(function () {
        cacheManager.init();
    }, 86400000, null);

    setInterval(function () {
        cacheManager.setInTheaterMoviesCache();
    }, 3600000, null);

    setInterval(function () {
        updateTheaterWithLocationList();
    }, 86400000, null);    
}
