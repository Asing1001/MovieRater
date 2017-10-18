import * as fetch from "isomorphic-fetch";
import { scheduleJob } from 'node-schedule';
import { systemSetting, schedulerSetting } from '../configs/systemSetting';
import { updateYahooMovies, updateTheaterWithLocationList } from '../task/yahooTask';
import { updatePttArticles } from '../task/pttTask';
import { updateImdbInfo } from '../task/imdbTask';
import cacheManager from '../data/cacheManager';

export function initScheduler() {
    if (!systemSetting.enableScheduler) {
        return;
    }
    console.log("[Scheduler] init");
    if (systemSetting.keepAlive) {
        setInterval(function () {
            fetch(systemSetting.websiteUrl).then(res =>
                console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`));
        }, 600000);
    }

    scheduleJob('10 * * * *', async function () {
        console.time('[Scheduler] updateYahooMovies');
        await updateYahooMovies(schedulerSetting.yahooPagePerTime)
        console.timeEnd('[Scheduler] updateYahooMovies');
    });

    scheduleJob('15 * * * *', async function () {
        console.time('[Scheduler] updatePttArticles');
        await updatePttArticles(schedulerSetting.pttPagePerTime);
        console.timeEnd('[Scheduler] updatePttArticles');
    });

    scheduleJob('20 * * * *', function () {
        cacheManager.setInTheaterMoviesCache();
    });

    // scheduleJob('30 5 * * *', async function () {
    //     console.time('[Scheduler] updateTheaterWithLocationList');
    //     await updateTheaterWithLocationList();
    //     console.timeEnd('[Scheduler] updateTheaterWithLocationList');
    // });

    scheduleJob('40 5 * * *', async function () {
        console.time('[Scheduler] cacheManager.init');
        await cacheManager.init();
        console.timeEnd('[Scheduler] cacheManager.init');
    });

    scheduleJob('30 6 * * *', async function () {
        console.time('[Scheduler] updateImdbInfo');
        await updateImdbInfo()
        console.timeEnd('[Scheduler] updateImdbInfo');
    });
}
