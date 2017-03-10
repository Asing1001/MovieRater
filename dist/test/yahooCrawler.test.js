"use strict";
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var yahooCrawler_1 = require("../crawler/yahooCrawler");
var db_1 = require("../data/db");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('YahooCrawler', function () {
    before(function () { return db_1.db.openDbConnection(); });
    describe('crawlYahooRange(10,20)', function () {
        it('should correctly get new data from yahoo', function () {
            this.timeout(30000);
            return yahooCrawler_1.crawlYahooRange(10, 20).should.eventually.have.length.above(0);
        });
    });
});
//# sourceMappingURL=yahooCrawler.test.js.map