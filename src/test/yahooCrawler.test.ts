import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlYahooRange} from '../crawler/yahooCrawler';
import {db} from "../data/db";
import {systemSetting} from '../configs/systemSetting'; 


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('YahooCrawler', () => {
  describe('crawlYahooRange(10,20)', () => {
    before(()=>{return db.openDbConnection(systemSetting.dbUrl)})
    it('should correctly get new data from yahoo', function () {
      this.timeout(30000);
      return crawlYahooRange(10,20).should.eventually.have.length.above(0)
    });
  });
});