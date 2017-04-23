import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getYahooMovieInfo } from '../crawler/yahooCrawler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);

describe('YahooCrawler', () => {
  describe('getYahooMovieInfo(10)', () => {
    it('.should.have.property("chineseTitle")', async function () {
      this.timeout(30000);
      const yahooMovie = await getYahooMovieInfo(10);
      yahooMovie.should.have.property('chineseTitle');
    });
  });

  describe('getYahooMovieInfo(9999)', () => {
    it('.should.eventually.be.rejected', function () {
      this.timeout(30000);
      return getYahooMovieInfo(9999).should.eventually.be.rejected;
    });
  });
});