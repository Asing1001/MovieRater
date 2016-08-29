import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlImdb} from '../crawler/imdbCrawler';
import {crawlYahoo,crawlYahooPage} from '../crawler/yahooCrawler';
import {db} from '../db';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('db', () => {
  describe('connection', () => {
    it('should not null when connection string is correct', () =>
      db.openDbConnection().should.eventually.exist
    );
  });

  describe('insertCollection', () => {
    it('should resolve when give empty array', () => db.insertCollection([], 'test').should.be.fulfilled);
  });
});

describe('Crawler', () => {
  describe('YahooCrawler', () => {
    it('should correctly get new data from yahoo', function () {
      this.timeout(20000);
      return crawlYahoo().then(() => {
        return db.getCollection("yahooMovies").then((yahooMovies) =>
          expect(yahooMovies.length).to.be.above(0)
        )
      })
    });
  });

  describe('crawlYahooPage', () => {
    it('should reject when yahooid not exist', function () {
      this.timeout(20000);
      return crawlYahooPage(99999).should.eventually.rejected;
    });
  });

  describe('crawlYahooPage', () => {
    it('should resolve when yahooid exist', function () {
      this.timeout(20000);
      return crawlYahooPage(6470).should.eventually.fulfilled;
    });
  });
});