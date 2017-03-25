import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlTheaterList} from '../crawler/theaterCrawler';
import {db} from "../data/db";
import Theater from "../models/theater";
// import * as moment from 'moment';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('imdbCrawler', () => {
  before(() => { return db.openDbConnection() })
  describe('crawlTheaterList().should.eventually.have.length.above(0)', () => {
    it('should correctly get theater list from yahoo', function () {
      this.timeout(30000);
      return crawlTheaterList().should.eventually.have.length.above(0)
    });
  });


  // describe('filterNeedCrawlMovie', () => {
  //   it('should return true if movie release in this year and not yet crawl today', function () {
  //     return assert.isTrue(filterNeedCrawlMovie(movie));
  //   });
  // });
});