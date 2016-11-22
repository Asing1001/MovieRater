import { crawlYahoo } from '../crawler/yahooCrawler';
import { crawlImdb } from '../crawler/imdbCrawler';
import { crawlPtt } from '../crawler/pttCrawler';
import { mergeData } from '../crawler/mergeData';
import { systemSetting } from '../configs/systemSetting';
import * as fetch from "isomorphic-fetch";
import { db } from "../data/db";
import * as Q from 'q';
import cacheManager from '../data/cacheManager';
import Movie from "../models/movie";

export function initScheduler() {

    console.log("[initScheduler] Create Schedule for keep website alive.");
    setInterval(function () {
        fetch(systemSetting.websiteUrl).then(res =>
            console.log(`[Scheduler] Access to website:${systemSetting.websiteUrl}, status:${res.status}`))
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for yahooCrawler and crawlImdb.");
    setInterval(function () {
        console.time('[Scheduler] crawlYahoo');
        crawlYahoo().then(() => {
            console.timeEnd('[Scheduler] crawlYahoo');
            console.time('[Scheduler] crawlImdb');
            crawlImdb().then(() => {
                console.timeEnd('[Scheduler] crawlImdb');
            });
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for pttCrawler and mergeData.");
    setInterval(function () {
        console.time('[Scheduler] crawlPtt');
        crawlPtt().then((pttPages) => {
            console.timeEnd('[Scheduler] crawlPtt');
        });
    }, 900000, null);

    console.log("[initScheduler] Create Schedule for cacheManager.init");
    setInterval(function () {
        cacheManager.init();
    }, 86400000, null);
}