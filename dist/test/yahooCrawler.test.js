"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const yahooCrawler_1 = require("../crawler/yahooCrawler");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('YahooCrawler', () => {
    describe('crawlYahooRange(10,11)', () => {
        it('should correctly get datas from yahoo', function () {
            this.timeout(30000);
            return yahooCrawler_1.crawlYahooRange(10, 11).should.eventually.have.length.above(0);
        });
    });
});
//# sourceMappingURL=yahooCrawler.test.js.map