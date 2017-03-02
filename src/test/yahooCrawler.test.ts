import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { crawlYahooRange } from '../crawler/yahooCrawler';
import { db } from "../data/db";


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('YahooCrawler', () => {
  before(() => { return db.openDbConnection() })
  describe('crawlYahooRange(10,20)', () => {
    it('should correctly get new data from yahoo', function () {
      this.timeout(30000);
      return crawlYahooRange(10, 20).should.eventually.have.length.above(0)
    });
  });
});