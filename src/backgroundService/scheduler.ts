import { crawlYahoo } from '../crawler/yahooCrawler';
import { crawlImdb } from '../crawler/imdbCrawler';
import { crawlPtt } from '../crawler/pttCrawler';
import { mergeData } from '../crawler/mergeData';
import { systemSetting } from '../configs/systemSetting';
import * as fetch from "isomorphic-fetch";
import { db } from "../data/db";
import * as Q from 'q';
import cacheManager from '../data/cacheManager';

export function initScheduler() {

    console.log("[initScheduler] Create Schedule for keep website alive.");
    setInterval(function () {
        fetch(systemSetting.websiteUrl).then(res =>
            console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`))
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for yahooCrawler and crawlImdb.");
    setInterval(function () {
        console.time('crawlYahoo');
        crawlYahoo().then(() => {
            console.log("[Scheduler] crawlYahoo success.");
            console.timeEnd('crawlYahoo');
            console.time('crawlImdb');
            crawlImdb().then(() => {
                console.log("[Scheduler] crawlImdb success.");
                console.timeEnd('crawlImdb');
            });
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for pttCrawler and mergeData.");
    setInterval(function () {
        console.time('crawlPtt');
        crawlPtt().then(() => {
            console.log("[Scheduler] crawlPtt success.");
            console.timeEnd('crawlPtt');
            console.time('mergeData');
            mergeData().then(() => {
                console.log("[Scheduler] mergeData success.")
                console.timeEnd('mergeData');
            })
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for cacheManager.init");
    setInterval(function () {
        cacheManager.init().then(() => {
            console.log("[Scheduler] cacheManager.init success.");
        });
    }, 3600000, null);
}