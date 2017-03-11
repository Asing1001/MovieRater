"use strict";
var yahooCrawler_1 = require('../crawler/yahooCrawler');
var omdbCrawler_1 = require('../crawler/omdbCrawler');
var pttCrawler_1 = require('../crawler/pttCrawler');
var systemSetting_1 = require('../configs/systemSetting');
var fetch = require("isomorphic-fetch");
var cacheManager_1 = require('../data/cacheManager');
function initScheduler() {
    console.log("[initScheduler] Create Schedule for keep website alive.");
    setInterval(function () {
        fetch(systemSetting_1.systemSetting.websiteUrl).then(function (res) {
            return console.log("[Scheduler] Access to website:" + systemSetting_1.systemSetting.websiteUrl + ", status:" + res.status);
        });
    }, 600000, null);
    console.log("[initScheduler] Create Schedule for yahooCrawler and crawlOmdb.");
    setInterval(function () {
        console.time('[Scheduler] crawlYahoo');
        yahooCrawler_1.crawlYahoo().then(function () {
            console.timeEnd('[Scheduler] crawlYahoo');
            console.time('[Scheduler] crawlOmdb');
            omdbCrawler_1.crawlOmdb().then(function () {
                console.timeEnd('[Scheduler] crawlOmdb');
            });
        });
    }, 900000, null);
    console.log("[initScheduler] Create Schedule for pttCrawler and mergeData.");
    setInterval(function () {
        console.time('[Scheduler] crawlPtt');
        pttCrawler_1.crawlPtt().then(function (pttPages) {
            console.timeEnd('[Scheduler] crawlPtt');
        });
    }, 900000, null);
    console.log("[initScheduler] Create Schedule for cacheManager.init");
    setInterval(function () {
        cacheManager_1.default.init();
    }, 86400000, null);
}
exports.initScheduler = initScheduler;
//# sourceMappingURL=scheduler.js.map