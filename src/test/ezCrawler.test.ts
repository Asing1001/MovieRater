import * as chai from 'chai';
import { getAllTheaters, getMoviesByCinemaId, getShowDatesByCinemaIdAndMovieId, getShowTimes } from '../crawler/ezCrawler';

const should = chai.should();
const assert = chai.assert;

describe('ezCrawler', () => {
  describe('getAllTheaters', () => {
    it('should.above(0)', async function () {
      this.timeout(30000);
      const theaters = await getAllTheaters();
      theaters.length.should.above(0);
    });
  });

  describe('getMoviesByCinemaId', () => {
    it('should.above(0)', async function () {
      this.timeout(30000);
      const movies = await getMoviesByCinemaId('73544d843cd311e69bb83d0f96c001c2');
      movies.length.should.above(0);
    });
  });

  describe('getShowDatesByCinemaIdAndMovieId', () => {
    it('should.above(0)', async function () {
      this.timeout(30000);
      const movies = await getShowDatesByCinemaIdAndMovieId('73544d843cd311e69bb83d0f96c001c2', '14554643a4674dda925eded0d33863e5');
      movies.length.should.above(0);
    });
  });

  describe('getShowDatesByCinemaIdAndMovieId', () => {
    it('should.above(0)', async function () {
      this.timeout(30000);
      const movies = await getShowTimes('5f60dacd-45b3-102d-8d74-e400529c',
        '67c7371dcb3f47cd90cf6268273493a1', '2017/07/18');
      movies.length.should.above(0);
    });
  });
});