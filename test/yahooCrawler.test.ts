import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlYahoo,crawlYahooPage} from '../crawler/yahooCrawler';
import {db} from '../db';
import {systemSetting} from '../configs/systemSetting'; 


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('YahooCrawler', () => {
  describe('crawlYahoo', () => {
    before(()=>{return db.openDbConnection(systemSetting.dbUrl)})
    it('should correctly get new data from yahoo', function () {
      this.timeout(30000);
      return crawlYahoo().should.eventually.have.length.above(0)
    });
  });

  describe('crawlYahooPage', () => {
    it('should reject when yahooid not exist', function () {
      this.timeout(5000);
      return crawlYahooPage(99999).should.eventually.rejected;
    });
  });

  describe('crawlYahooPage', () => {
    it('should resolve when yahooid exist', function () {
      this.timeout(10000);
      return crawlYahooPage(6470).should.eventually.fulfilled;
    });
  });
});