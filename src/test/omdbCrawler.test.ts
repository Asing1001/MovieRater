import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {crawlOmdb, filterNeedCrawlMovie} from '../crawler/omdbCrawler';
import {db} from "../data/db";
import Movie from "../models/movie";
import * as moment from 'moment';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('imdbCrawler', () => {
  // should remove omdb dependency in unit test
  // describe('crawlImdb', () => {
  //   before(()=>{return db.openDbConnection()})
  //   it('should correctly get new data from imdb', function () {
  //     this.timeout(60000);
  //     return crawlImdb().should.eventually.fulfilled
  //   });
  // });

  describe('filterNeedCrawlMovie', () => {
    it('should return true if movie release in this year and not yet crawl today', function () {
      let movie:Movie = {
        englishTitle:'unitTest',
        releaseDate:moment().format(),
        imdbLastCrawlTime:moment().subtract(2,'days').format()
      };
      return assert.isTrue(filterNeedCrawlMovie(movie));
    });
  });
});