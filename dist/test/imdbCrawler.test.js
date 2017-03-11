"use strict";
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var imdbCrawler_1 = require('../crawler/imdbCrawler');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('imdbCrawler', function () {
    describe('crawlImdb', function () {
        it('should correctly get new data from imdb', function () {
            this.timeout(60000);
            return imdbCrawler_1.default("tt4972582").should.eventually.fulfilled;
        });
        it('should correctly get new data from imdb', function () {
            this.timeout(60000);
            return imdbCrawler_1.default("").should.eventually.fulfilled;
        });
    });
});
//# sourceMappingURL=imdbCrawler.test.js.map