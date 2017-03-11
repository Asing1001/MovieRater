import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlPtt, crawlPttPage} from '../crawler/pttCrawler';
import {db} from "../data/db";

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('pttCrawler', () => {
    describe('crawlPtt', () => {
        before(() => { return db.openDbConnection() })
        it('should correctly get new data from Ptt', function () {
            this.timeout(30000);
            return crawlPtt().should.eventually.fulfilled//have.articles.length.above(0)
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