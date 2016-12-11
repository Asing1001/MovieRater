import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { crawlInTheater } from '../crawler/yahooInTheaterCrawler';
import { db } from "../data/db";
import { systemSetting } from '../configs/systemSetting';


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('yahooInTheaterCrawler', () => {
  before(() => { return db.openDbConnection(systemSetting.dbUrl) })
  describe('crawlInTheater.', () => {
    it('should got yahooId list.', function () {
      this.timeout(30000);
      return crawlInTheater().should.eventually.have.length.above(0)
    });
  });
});