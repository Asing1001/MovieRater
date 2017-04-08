"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const cheerio = require("cheerio");
const db_1 = require("../data/db");
const Q = require("q");
const moment = require("moment");
const cacheManager_1 = require("../data/cacheManager");
const pttBaseUrl = 'https://www.ptt.cc';
const crawlerStatusFilter = { name: "crawlerStatus" };
let startPttIndex = 1;
function crawlPtt(howManyPagePerTime) {
    return db_1.db.getDocument(crawlerStatusFilter, "configs").then(crawlerStatus => {
        if (crawlerStatus && crawlerStatus.maxPttIndex) {
            startPttIndex = crawlerStatus.maxPttIndex + 1;
        }
        return crawlPttRange(startPttIndex, startPttIndex + howManyPagePerTime);
    }).then((pttPages) => {
        updatePttMaxIndex(pttPages);
        let allArticles = [].concat(...pttPages.map(({ articles }) => articles));
        let promises = allArticles.map(article => db_1.db.updateDocument({ url: article.url }, article, "pttArticles"));
        return Q.all(promises).then(() => pttPages);
    });
}
exports.crawlPtt = crawlPtt;
function crawlPttRange(startId, endId) {
    const promises = [];
    for (let i = startId; i <= endId; i++) {
        const promise = crawlPttPage(i);
        promises.push(promise);
    }
    return Q.allSettled(promises).then(results => {
        let pttPages = [];
        results.forEach((result) => {
            if (result.state === "fulfilled") {
                var value = result.value;
                pttPages.push(value);
            }
            else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        return pttPages;
    });
}
exports.crawlPttRange = crawlPttRange;
function updatePttMaxIndex(pttPages) {
    let pttIndexs = pttPages.map(({ pageIndex }) => pageIndex);
    let newMaxPttIndex = Math.max(...pttIndexs, startPttIndex);
    let alreadyCrawlTheNewest = newMaxPttIndex === startPttIndex;
    if (alreadyCrawlTheNewest) {
        newMaxPttIndex = newMaxPttIndex - 100 > 0 ? newMaxPttIndex - 100 : 1;
    }
    db_1.db.updateDocument(crawlerStatusFilter, { maxPttIndex: newMaxPttIndex }, 'configs');
    console.log(`new pttPages count:${pttPages.length}, newMaxPttIndex:${newMaxPttIndex}`);
}
function crawlPttPage(index) {
    const defer = Q.defer();
    const pttPageUrl = `${pttBaseUrl}/bbs/movie/index${index}.html`;
    request(pttPageUrl, (error, r, html) => {
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
            let $articleInfoDiv = $(articleInfoDiv);
            let articleUrl = $articleInfoDiv.find('.title>a').attr('href');
            let articleHasDeleted = !articleUrl;
            let date = articleHasDeleted ? moment().format('YYYY/MM/DD') : moment(parseInt(articleUrl.split('.')[1]) * 1000).format('YYYY/MM/DD');
            let articleTitle = $articleInfoDiv.find('.title>a').text();
            const articleInfo = {
                yahooId: getMatchedYahooId(articleTitle, date),
                title: articleTitle,
                push: $articleInfoDiv.find('.nrec>.hl').text(),
                url: articleUrl,
                date: date,
                author: $articleInfoDiv.find('.meta>.author').text()
            };
            return articleInfo;
        });
        const pageInfo = {
            pageIndex: index,
            url: pttPageUrl,
            articles: articleInfos
        };
        defer.resolve(pageInfo);
    });
    return defer.promise;
}
exports.crawlPttPage = crawlPttPage;
function getMatchedYahooId(articleTitle, date) {
    let matchedYahooMovie = cacheManager_1.default.get(cacheManager_1.default.All_MOVIES).find((yahooMovie) => {
        let releaseDate = moment(yahooMovie.releaseDate);
        let releaseYear = releaseDate.year();
        let rangeStart = releaseDate.clone().subtract(3, 'months');
        let rangeEnd = releaseDate.clone().add(6, 'months');
        let articleFullDate = moment(date, 'YYYY/MM/DD');
        let isInNearMonth = articleFullDate.isBetween(rangeStart, rangeEnd);
        let isChinesetitleMatch = articleTitle.indexOf(yahooMovie.chineseTitle) !== -1;
        return isChinesetitleMatch && isInNearMonth;
    });
    return matchedYahooMovie ? matchedYahooMovie.yahooId : null;
}
exports.getMatchedYahooId = getMatchedYahooId;
//# sourceMappingURL=pttCrawler.js.map