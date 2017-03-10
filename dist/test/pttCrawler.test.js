"use strict";
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var pttCrawler_1 = require("../crawler/pttCrawler");
var db_1 = require("../data/db");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('pttCrawler', function () {
    describe('crawlPtt', function () {
        before(function () { return db_1.db.openDbConnection(); });
        it('should correctly get new data from Ptt', function () {
            this.timeout(30000);
            return pttCrawler_1.crawlPtt().should.eventually.fulfilled; //have.articles.length.above(0)
        });
    });
    describe('crawlPttPage', function () {
        it('should reject when Pttid not exist', function () {
            this.timeout(5000);
            var pageIndex = 99999;
            return pttCrawler_1.crawlPttPage(pageIndex).should.eventually
                .rejectedWith("index" + pageIndex + " not exist, server return:500 - Internal Server Error / Server Too Busy.");
        });
    });
    describe('crawlPttPage', function () {
        it('should resolve when Pttid exist', function () {
            this.timeout(5000);
            return pttCrawler_1.crawlPttPage(4000).should.eventually.fulfilled;
        });
    });
});
//# sourceMappingURL=pttCrawler.test.js.map