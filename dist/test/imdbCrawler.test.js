"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const imdbCrawler_1 = require("../crawler/imdbCrawler");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('imdbCrawler', () => {
    describe('crawlImdb', () => {
        it('crawlImdb("tt4972582").should.eventually.fulfilled', function () {
            this.timeout(60000);
            return imdbCrawler_1.default("tt4972582").should.eventually.fulfilled;
        });
        it('crawlImdb("").should.eventually.equal("")', function () {
            this.timeout(60000);
            return imdbCrawler_1.default("").should.eventually.equal("");
        });
    });
});
//# sourceMappingURL=imdbCrawler.test.js.map