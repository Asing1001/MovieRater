"use strict";
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var yahooInTheaterCrawler_1 = require('../crawler/yahooInTheaterCrawler');
var db_1 = require("../data/db");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('yahooInTheaterCrawler', function () {
    before(function () { return db_1.db.openDbConnection(); });
    describe('crawlInTheater.', function () {
        it('should got yahooId list.', function () {
            this.timeout(30000);
            return yahooInTheaterCrawler_1.crawlInTheater().should.eventually.have.length.above(0);
        });
    });
});
//# sourceMappingURL=yahooInTheaterCrawler.test.js.map