import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlImdb} from '../crawler/imdbCrawler';
import {crawlYahoo} from '../crawler/yahooCrawler';
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
});

describe('Crawler', () => {
  describe('YahooCrawler', () => {
    it('should correctly get new data from yahoo', function() {
      this.timeout(5000);
      return crawlYahoo().then(() => {
        return db.getCollection("yahooMovies").then((yahooMovies) =>
          expect(yahooMovies.length).to.be.above(100)
        )
      })
    });
  });
});

