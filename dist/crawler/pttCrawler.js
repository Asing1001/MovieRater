"use strict";
var request = require("request");
var cheerio = require("cheerio");
var db_1 = require("../data/db");
var Q = require("q");
var systemSetting_1 = require('../configs/systemSetting');
var moment = require('moment');
var pttBaseUrl = 'https://www.ptt.cc';
var crawlerStatusFilter = { name: "crawlerStatus" };
function crawlPtt() {
    var howManyPagePerTime = 50;
    var startPttIndex = 1;
    return db_1.db.getDocument(crawlerStatusFilter, "configs").then(function (crawlerStatus) {
        if (crawlerStatus && crawlerStatus.maxPttIndex) {
            startPttIndex = crawlerStatus.maxPttIndex + 1;
        }
        if (systemSetting_1.pttCrawlerSetting.enable) {
            startPttIndex = systemSetting_1.pttCrawlerSetting.startPttIndex;
            howManyPagePerTime = systemSetting_1.pttCrawlerSetting.howManyPagePerTime;
        }
        var promises = [];
        for (var i = startPttIndex; i <= startPttIndex + howManyPagePerTime; i++) {
            var promise = crawlPttPage(i);
            promises.push(promise);
        }
        return Q.allSettled(promises);
    }).then(function (results) {
        var pttPages = [];
        results.forEach(function (result) {
            if (result.state === "fulfilled") {
                var value = result.value;
                pttPages.push(value);
            }
            else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        var pttIndexs = pttPages.map(function (_a) {
            var pageIndex = _a.pageIndex;
            return pageIndex;
        });
        var newMaxPttIndex = Math.max.apply(Math, pttIndexs.concat([startPttIndex]));
        var alreadyCrawlTheNewest = newMaxPttIndex === startPttIndex;
        if (alreadyCrawlTheNewest) {
            newMaxPttIndex = newMaxPttIndex - 100 > 0 ? newMaxPttIndex - 100 : 1;
        }
        db_1.db.updateDocument(crawlerStatusFilter, { maxPttIndex: newMaxPttIndex }, 'configs');
        console.log("new pttPages count:" + pttPages.length + ", newMaxPttIndex:" + newMaxPttIndex);
        var promises = pttPages.map(function (pttPage) { return db_1.db.updateDocument({ pageIndex: pttPage.pageIndex }, pttPage, "pttPages"); });
        return Q.all(promises).then(function () { return pttPages; });
    });
}
exports.crawlPtt = crawlPtt;
function crawlPttPage(index) {
    var defer = Q.defer();
    var pttPageUrl = pttBaseUrl + "/bbs/movie/index" + index + ".html";
    request(pttPageUrl, function (error, r, html) {
        if (error) {
            return defer.reject(error);
        }
        var $ = cheerio.load(html);
        var $articleInfoDivs = $('.r-ent');
        if (!$articleInfoDivs.length) {
            var serverReturn = $('.bbs-screen.bbs-content').text();
            return defer.reject("index" + index + " not exist, server return:" + serverReturn);
        }
        var articleInfos = Array.from($articleInfoDivs).map(function (articleInfoDiv) {
            var $articleInfoDiv = $(articleInfoDiv);
            var articleUrl = $articleInfoDiv.find('.title>a').attr('href');
            var articleHasDeleted = !articleUrl;
            var date = articleHasDeleted ? moment().format('YYYY/MM/DD') : moment(parseInt(articleUrl.split('.')[1]) * 1000).format('YYYY/MM/DD');
            var articleInfo = {
                title: $articleInfoDiv.find('.title>a').text(),
                push: $articleInfoDiv.find('.nrec>.hl').text(),
                url: articleUrl,
                date: date,
                author: $articleInfoDiv.find('.meta>.author').text()
            };
            return articleInfo;
        });
        var pageInfo = {
            pageIndex: index,
            url: pttPageUrl,
            articles: articleInfos
        };
        defer.resolve(pageInfo);
    });
    return defer.promise;
}
exports.crawlPttPage = crawlPttPage;
//# sourceMappingURL=pttCrawler.js.map