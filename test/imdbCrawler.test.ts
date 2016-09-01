import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlImdb} from '../crawler/imdbCrawler';
import {db} from '../db';
import {systemSetting} from '../configs/systemSetting'; 


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('imdbCrawler', () => {
  describe('crawlImdb', () => {
    before(()=>{return db.openDbConnection(systemSetting.dbUrl)})
    it('should correctly get new data from imdb', function () {
      this.timeout(30000);
      return crawlImdb().should.eventually.fullfilled//have.length.above(0)
    });
  });
});