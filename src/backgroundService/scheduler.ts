import { updateYahooMovies, updateTheaterWithLocationList } from '../task/yahooTask';
import { updatePttArticles } from '../task/pttTask';
import { systemSetting, schedulerSetting } from '../configs/systemSetting';
import * as fetch from "isomorphic-fetch";
import cacheManager from '../data/cacheManager';
import { updateImdbInfo } from '../task/imdbTask';

export function initScheduler() {
    if (!systemSetting.enableScheduler) {
        return;        
    }
    console.log("[initScheduler]");
    setInterval(function () {
        fetch(systemSetting.websiteUrl).then(res =>
            console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`));
    }, 600000);

    setInterval(async function () {
        console.time('[Scheduler] crawlYahoo');
        await updateYahooMovies(schedulerSetting.yahooPagePerTime)
        console.timeEnd('[Scheduler] crawlYahoo');
        console.time('[Scheduler] updateImdbInfo');
        await updateImdbInfo()
        console.timeEnd('[Scheduler] updateImdbInfo');
    }, 3600000);

    setInterval(async function () {
        console.time('[Scheduler] crawlPtt');
        await updatePttArticles(schedulerSetting.pttPagePerTime);
        console.timeEnd('[Scheduler] crawlPtt');
    }, 3600000);

    setInterval(function () {
        cacheManager.init();
    }, 86400000);

    setInterval(function () {
        cacheManager.setInTheaterMoviesCache();
    }, 3600000);

    setInterval(function () {
        updateTheaterWithLocationList();
    }, 86400000);
}
