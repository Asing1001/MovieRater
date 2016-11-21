import * as request from "request";
import * as cheerio from "cheerio";
import { db } from "../data/db";
import * as Q from "q";
import { pttCrawlerSetting } from '../configs/systemSetting';

const pttBaseUrl = 'https://www.ptt.cc';
const crawlerStatusFilter = { name: "crawlerStatus" };
export function crawlPtt() {
    let howManyPagePerTime = 50;
    let startPttIndex = 1;
    return db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus && crawlerStatus.maxPttIndex) {
            startPttIndex = crawlerStatus.maxPttIndex + 1;
        }

        if (pttCrawlerSetting.enable) {
            startPttIndex = pttCrawlerSetting.startPttIndex;
            howManyPagePerTime = pttCrawlerSetting.howManyPagePerTime;
        }

        const promises = [];
        for (let i = startPttIndex; i <= startPttIndex + howManyPagePerTime; i++) {
            const promise = crawlPttPage(i);
            promises.push(promise);
        }

        return Q.allSettled(promises);
    }).then((results) => {
        let pttPages = [];
        results.forEach((result) => {
            if (result.state === "fulfilled") {
                var value = result.value;
                pttPages.push(value);
            } else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        let pttIndexs = pttPages.map(({pageIndex}) => pageIndex);
        let newMaxPttIndex = Math.max(...pttIndexs, startPttIndex);
        let alreadyCrawlTheNewest = newMaxPttIndex === startPttIndex;
        if (alreadyCrawlTheNewest) {
            newMaxPttIndex = newMaxPttIndex - 100 > 0 ? newMaxPttIndex - 100 : 1;
        }
        db.updateDocument(crawlerStatusFilter, { maxPttIndex: newMaxPttIndex }, 'configs');
        console.log(`new pttPages count:${pttPages.length}, newMaxPttIndex:${newMaxPttIndex}`);
        let promises = pttPages.map(pttPage => db.updateDocument({ pageIndex: pttPage.pageIndex }, pttPage, "pttPages"))
        return Q.all(promises);
    })
}

export function crawlPttPage(index) {
    const defer = Q.defer();
    const pttPageUrl = `${pttBaseUrl}/bbs/movie/index${index}.html`;
    request(pttPageUrl, (error, r, html: string) => {
        if (error) {
            return defer.reject(error);
        }
        const $ = cheerio.load(html);
        const $articleInfoDivs = $('.r-ent');
        if (!$articleInfoDivs.length) {
            let serverReturn = $('.bbs-screen.bbs-content').text();
            return defer.reject(`index${index} not exist, server return:${serverReturn}`);
        }
        const articleInfos = Array.from($articleInfoDivs).map((articleInfoDiv) => {
            const $articleInfoDiv = $(articleInfoDiv);
            const articleInfo = {
                title: $articleInfoDiv.find('.title>a').text(),
                push: $articleInfoDiv.find('.nrec>.hl').text(),
                url: pttBaseUrl + $articleInfoDiv.find('.title>a').attr('href'),
                date: $articleInfoDiv.find('.meta>.date').text(),
                author: $articleInfoDiv.find('.meta>.author').text()
            };
            return articleInfo;
        });
        const pageInfo = {
            pageIndex: index,
            url: pttPageUrl,
            articles: articleInfos
        }

        defer.resolve(pageInfo);
    })
    return defer.promise;
}