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
      yahooMovie.should.have.property('englishTitle');
      yahooMovie.summary.length.should.greaterThan(0);
      yahooMovie.posterUrl.length.should.greaterThan(0);
      yahooMovie.actors.length.should.equal(2);
      yahooMovie.directors.length.should.equal(1);
      yahooMovie.yahooRating.should.greaterThan(4);
    });
  });

  describe('getYahooMovieInfo(99999)', () => {
    it('.should.eventually.be.rejected', function () {
      this.timeout(30000);
      return getYahooMovieInfo(99999).should.eventually.be.rejected;
    });
  });

  describe('getYahooMovieInfo(6794)', () => {
    it('.summary should include html <br> tag', async function () {
      this.timeout(30000);
      const movieInfo: YahooMovie = await getYahooMovieInfo(6794);
      assert.isTrue(movieInfo.summary.indexOf('<br>') !== -1);
    });
  });

  describe('getYahooMovieInfo(12438)', () => {
    it('.should parse actors and directors correctly', async function () {
      this.timeout(30000);
      const movieInfo: YahooMovie = await getYahooMovieInfo(12438);
      movieInfo.actors.length.should.equal(6);
      movieInfo.directors[0].should.equal(
        '克斯提安施沃考夫(Christian Schwochow)'
      );
      movieInfo.imdbRating.should.greaterThan(6).lessThan(8);
    });
  });

  describe('getYahooMovieInfo(14908)', () => {
    it('.should parse imdb rating correctly', async function () {
      this.timeout(30000);
      const movieInfo: YahooMovie = await getYahooMovieInfo(14908);
      movieInfo.imdbRating.should.greaterThan(6).lessThan(8);
    });
  });

  describe('getYahooMovieInfo(13379)', () => {
    it('.should parse imdb rating correctly', async function () {
      this.timeout(30000);
      const movieInfo: YahooMovie = await getYahooMovieInfo(13379);
      movieInfo.imdbRating.includes('克里斯多夫麥奎利(Christopher McQuarrie)')
        .should.be.false;
    });
  });
});
