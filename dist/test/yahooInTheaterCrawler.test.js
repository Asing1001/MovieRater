"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const yahooInTheaterCrawler_1 = require("../crawler/yahooInTheaterCrawler");
const db_1 = require("../data/db");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('yahooInTheaterCrawler', () => {
    before(() => { return db_1.db.openDbConnection(); });
    describe('crawlInTheater.', () => {
        it('should got yahooId list.', function () {
            this.timeout(30000);
            return yahooInTheaterCrawler_1.crawlInTheater().should.eventually.have.length.above(0);
        });
    });
});
//# sourceMappingURL=yahooInTheaterCrawler.test.js.map