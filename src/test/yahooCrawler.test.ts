import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getYahooMovieInfo } from '../crawler/yahooCrawler';
import YahooMovie from '../models/yahooMovie';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);

describe('YahooCrawler', () => {
  describe('getYahooMovieInfo(10)', () => {
    it('.should.have.property("chineseTitle")', async function () {
      this.timeout(300000);
      const yahooMovie: YahooMovie = await getYahooMovieInfo(10);
      yahooMovie.should.have.property('chineseTitle');
      assert.isTrue(yahooMovie.summary.length > 0);
      assert.isTrue(yahooMovie.posterUrl.length > 0);
    });
  });

  describe('getYahooMovieInfo(9999)', () => {
    it('.should.eventually.be.rejected', function () {
      this.timeout(30000);
      return getYahooMovieInfo(9999).should.eventually.be.rejected;
    });
  });

  describe('getYahooMovieInfo(6794)', () => {
    it('.should.eventually.be.rejected', async function () {
      this.timeout(30000);
      const movieInfo: YahooMovie = await getYahooMovieInfo(6794);
      assert.isTrue(movieInfo.summary.indexOf('<br>') !== -1)
    });
  });
});