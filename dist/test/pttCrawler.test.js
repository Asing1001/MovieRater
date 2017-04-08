"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const pttCrawler_1 = require("../crawler/pttCrawler");
const cacheManager_1 = require("../data/cacheManager");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
const testMoviesData = [{
        "yahooId": 6571,
        "chineseTitle": "羅根",
        "englishTitle": "Logan",
        "releaseDate": "2017-02-28",
    }, {
        "yahooId": 999999,
        "chineseTitle": "chineseTitle",
        "englishTitle": "englishTitle",
        "releaseDate": "2013-02-28",
    }];
describe('pttCrawler', () => {
    describe('getMatchedYahooId', () => {
        before(() => {
            cacheManager_1.default.set(cacheManager_1.default.All_MOVIES, testMoviesData);
            return;
        });
        it('should find match yahooId 6571', function () {
            return pttCrawler_1.getMatchedYahooId("[普雷] 羅根 (原來還蠻血腥的)", "2017/03/14").should.equal(6571);
        });
    });
    describe('crawlPtt', () => {
        it('crawlPtt(1).should.eventually.fulfilled', function () {
            this.timeout(10000);
            return pttCrawler_1.crawlPtt(1).should.eventually.fulfilled;
        });
    });
    describe('crawlPttRange', () => {
        it('crawlPttRange(4000,4001).should.eventually.have.length.equal(2)', function () {
            this.timeout(10000);
            return pttCrawler_1.crawlPttRange(4000, 4001).should.eventually.have.property('length', 2);
        });
    });
    describe('crawlPttPage', () => {
        it('should reject when Pttid not exist', function () {
            this.timeout(5000);
            let pageIndex = 99999;
            return pttCrawler_1.crawlPttPage(pageIndex).should.eventually
                .rejectedWith(`index${pageIndex} not exist, server return:500 - Internal Server Error / Server Too Busy.`);
        });
        it('should resolve when Pttid exist', function () {
            this.timeout(5000);
            return pttCrawler_1.crawlPttPage(4000).should.eventually.fulfilled;
        });
    });
});
//# sourceMappingURL=pttCrawler.test.js.map