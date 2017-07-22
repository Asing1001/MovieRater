import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import crawlyahooMovieSchdule from '../crawler/yahooMovieSchduleCrawler';
import {db} from "../data/db";
import Movie from "../models/movie";
import * as moment from 'moment';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('yahooMovieSchduleCrawler', () => {
  describe('crawyahooMovieSchdule', () => {
    it.skip('should correctly get new data from yahoo', function () {
      this.timeout(60000);
      return crawlyahooMovieSchdule("6707").should.eventually.have.length.above(0)
    });
  });
});