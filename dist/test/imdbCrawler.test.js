"use strict";
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var imdbCrawler_1 = require('../crawler/imdbCrawler');
var moment = require('moment');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('imdbCrawler', function () {
    // should remove omdb dependency in unit test
    // describe('crawlImdb', () => {
    //   before(()=>{return db.openDbConnection()})
    //   it('should correctly get new data from imdb', function () {
    //     this.timeout(60000);
    //     return crawlImdb().should.eventually.fulfilled
    //   });
    // });
    describe('filterNeedCrawlMovie', function () {
        it('should return true if movie release in this year and not yet crawl today', function () {
            var movie = {
                englishTitle: 'unitTest',
                releaseDate: moment().format(),
                imdbLastCrawlTime: moment().subtract(2, 'days').format()
            };
            return assert.isTrue(imdbCrawler_1.filterNeedCrawlMovie(movie));
        });
    });
});
//# sourceMappingURL=imdbCrawler.test.js.map