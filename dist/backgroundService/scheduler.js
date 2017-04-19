"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yahooCrawler_1 = require("../crawler/yahooCrawler");
const pttCrawler_1 = require("../crawler/pttCrawler");
const systemSetting_1 = require("../configs/systemSetting");
const fetch = require("isomorphic-fetch");
const cacheManager_1 = require("../data/cacheManager");
const imdbTask_1 = require("../task/imdbTask");
function initScheduler() {
    console.log("[initScheduler] Create Schedule for keep website alive.");
    setInterval(function () {
        fetch(systemSetting_1.systemSetting.websiteUrl).then(res => console.log(`[Scheduler] Access to website:${systemSetting_1.systemSetting.websiteUrl}, status:${res.status}`));
    }, 600000, null);
    console.log("[initScheduler] Create Schedule for yahooCrawler and updateImdbInfo.");
    setInterval(function () {
        console.time('[Scheduler] crawlYahoo');
        yahooCrawler_1.crawlYahoo(systemSetting_1.schedulerSetting.yahooPagePerTime).then(() => {
            console.timeEnd('[Scheduler] crawlYahoo');
            console.time('[Scheduler] updateImdbInfo');
            imdbTask_1.updateImdbInfo().then(() => {
                console.timeEnd('[Scheduler] updateImdbInfo');
            });
        });
    }, 900000, null);
    console.log("[initScheduler] Create Schedule for pttCrawler.");
    setInterval(function () {
        console.time('[Scheduler] crawlPtt');
        pttCrawler_1.crawlPtt(systemSetting_1.schedulerSetting.pttPagePerTime).then(() => {
            console.timeEnd('[Scheduler] crawlPtt');
        });
    }, 900000, null);
    console.log("[initScheduler] Create Schedule for cacheManager.init");
    setInterval(function () {
        cacheManager_1.default.init();
    }, 86400000, null);
    console.log("[initScheduler] Create Schedule for cacheManager.setInTheaterMoviesCache");
    setInterval(function () {
        cacheManager_1.default.setInTheaterMoviesCache();
    }, 3600000, null);
}
exports.initScheduler = initScheduler;
//# sourceMappingURL=scheduler.js.map