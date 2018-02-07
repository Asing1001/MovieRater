import * as chai from 'chai';
import { getInTheaterMovieNames } from '../crawler/atmovieInTheaterCrawler';

const should = chai.should();
const assert = chai.assert;

describe('atmovieInTheaterCrawler', () => {
  describe('getInTheaterMovieNames', () => {
    it('should.above(0)', async function () {
      this.timeout(30000);
      const movieNames = await getInTheaterMovieNames();
      movieNames.length.should.above(0);
    });
  });
});