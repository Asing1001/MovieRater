import * as chai from 'chai';
import { crawlMovieSchdule } from '../crawler/movieSchduleCrawler';
import * as moment from 'moment';

const should = chai.should();

describe('movieSchduleCrawler', () => {
  describe('crawlMovieSchdule', () => {
    it('data should have timeStrings length > 0', async function () {
      this.timeout(60000);
      const movieSchedules = await crawlMovieSchdule(
        '/showtime/t02a01/a02/',
        moment().add(0, 'days').format('YYYYMMDD')
      );
      movieSchedules[0].timesStrings.length.should.greaterThan(0);
    });
  });
});
