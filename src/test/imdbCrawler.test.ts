import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import crawlImdb from '../crawler/imdbCrawler';
import {db} from "../data/db";
import Movie from "../models/movie";
import * as moment from 'moment';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('imdbCrawler', () => {
  describe('crawlImdb', () => {
    it('crawlImdb("tt4972582").should.eventually.fulfilled', function () {
      this.timeout(60000);
      return crawlImdb("tt4972582").should.eventually.fulfilled
    });

    it('crawlImdb("").should.eventually.equal("")', function () {
      this.timeout(60000);
      return crawlImdb("").should.eventually.equal("")
    });
  });
});