import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getMatchedYahooId, crawlPttPage } from '../crawler/pttCrawler';
import { db } from "../data/db";
import cacheManager from '../data/cacheManager';

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
},{
    "yahooId": 999999,
    "chineseTitle": "chineseTitle",
    "englishTitle": "englishTitle",
    "releaseDate": "2013-02-28",
}]

describe('pttCrawler', () => {
    describe('getMatchedYahooId', () => {
        before(() => {
            cacheManager.set(cacheManager.All_MOVIES, testMoviesData)
            return;
        })
        it('should find match yahooId 6571', function () {
            return getMatchedYahooId("[普雷] 羅根 (原來還蠻血腥的)", "2017/03/14").should.have.property("yahooId",6571);
        });
    });

    describe('crawlPttPage', () => {
        it('should reject when Pttid not exist', function () {
            this.timeout(5000);
            let pageIndex = 99999
            return crawlPttPage(pageIndex).should.eventually
                .rejectedWith(`index${pageIndex} not exist, server return:500 - Internal Server Error / Server Too Busy.`);
        });
    });

    describe('crawlPttPage', () => {
        it('should resolve when Pttid exist', function () {
            this.timeout(5000);
            return crawlPttPage(4000).should.eventually.fulfilled;
        });
    });
});

