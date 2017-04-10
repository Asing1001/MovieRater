"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const omdbCrawler_1 = require("../crawler/omdbCrawler");
const moment = require("moment");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('omdbCrawler', () => {
    // describe('crawOImdb', () => {
    //   before(()=>{return db.openDbConnection()})
    //   it('should correctly get new data from imdb', function () {
    //     this.timeout(60000);
    //     return crawlOmdb().should.eventually.fulfilled
    //   });
    // });
    describe('filterNeedCrawlMovie', () => {
        it('should return true if movie release in this year and not yet crawl today', function () {
            let movie = {
                englishTitle: 'unitTest',
                releaseDate: moment().format(),
                imdbLastCrawlTime: moment().subtract(2, 'days').format()
            };
            return assert.isTrue(omdbCrawler_1.filterNeedCrawlMovie(movie));
        });
    });
});
//# sourceMappingURL=omdbCrawler.test.js.map