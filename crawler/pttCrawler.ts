import * as request from "request";
import * as cheerio from "cheerio";
import {db} from "../data/db";
import * as Q from "q";
import {pttCrawlerSetting} from '../configs/systemSetting'; 

const pttBaseUrl = 'https://www.ptt.cc';
export function crawlPtt() {
    console.time('crawlPtt');
    const crawlerStatusFilter = { name: "crawlerStatus" };
    let [maxPttIndex,endIndex] = [4482,4482];
    let startIndex = maxPttIndex-10;
    return db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus && crawlerStatus.maxPttIndex) {
            endIndex = crawlerStatus.maxPttIndex + 5;
        }

        if(pttCrawlerSetting.enable){
            startIndex = pttCrawlerSetting.startIndex;
            endIndex = pttCrawlerSetting.endIndex;
        }

        const promises = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const promise = crawlPttPage(i);
            promises.push(promise);
        }
        let newestPagePromise = crawlPttPage('');
        promises.push(newestPagePromise);
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
        maxPttIndex = Math.max(...pttIndexs);
        db.updateDocument(crawlerStatusFilter, { maxPttIndex: maxPttIndex }, 'configs');
        console.timeEnd('crawlPtt');        
        console.log(`new pttPages count:${pttPages.length}, maxPttIndex:${maxPttIndex}`);
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
        if(!$articleInfoDivs.length){
           let serverReturn =  $('.bbs-screen.bbs-content').text();
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