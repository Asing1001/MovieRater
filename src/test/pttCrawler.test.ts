import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getMatchedYahooId, getPttPage } from '../crawler/pttCrawler';
import cacheManager from '../data/cacheManager';

chai.use(chaiAsPromised);
chai.should();

describe('pttCrawler', () => {
    describe('getMatchedYahooId', () => {
        before(() => {
            const testMoviesData = [{
                "yahooId": 6571,
                "chineseTitle": "羅根",
                "englishTitle": "Logan",
                "releaseDate": "2017-02-28",
            }, {
                "yahooId": 999999,
                "chineseTitle": "chineseTitle",
                "englishTitle": "englishTitle",
                "releaseDate": "2013-02-28",
            }]
            cacheManager.set(cacheManager.All_MOVIES, testMoviesData)
            return;
        })
        it('should find match yahooId 6571', function () {
            return getMatchedYahooId("[普雷] 羅根 (原來還蠻血腥的)", "2017/03/14").should.equal(6571);
        });
    });

    describe('getPttPage', () => {
        it('should reject when Pttid not exist', function () {
            this.timeout(5000);
            let pageIndex = 99999
            return getPttPage(pageIndex).should.eventually
                .rejectedWith(`index${pageIndex} not exist, server return:404 - Not Found.`);
        });

        it('should resolve when Pttid exist', async function () {
            this.timeout(5000);
            const pttPage = await getPttPage(4000);
            pttPage.articles.length.should.greaterThan(0);
        });
    });
});

