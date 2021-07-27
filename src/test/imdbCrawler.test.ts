import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getIMDBMovieInfo, getIMDBRating } from '../crawler/imdbCrawler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('imdbCrawler', () => {
  describe('getIMDBMovieInfo', () => {
    it('getIMDBMovieInfo("Who Killed Cock Robin").should.have.property("imdbID","tt5576318"),"imdbRating".above(7)', async function () {
      this.timeout(30000);
      const movieInfo = await getIMDBMovieInfo({ englishTitle: "Who Killed Cock Robin", releaseDate: '2017-03-31' });
      movieInfo.should.have.property("imdbID", "tt5576318");
      movieInfo.should.have.property("imdbRating").above(6);
    });

    it('getIMDBMovieInfo(" A Silent Voice : The Movie").should.have.property("imdbID","tt5323662"),"imdbRating".above(7)', async function () {
      this.timeout(30000);
      const movieInfo = await getIMDBMovieInfo({ englishTitle: " A Silent Voice : The Movie", releaseDate: '2020-06-12' });
      movieInfo.should.have.property("imdbID", "tt5323662");
      movieInfo.should.have.property("imdbRating").above(7);
    });

    it('get Ireesha, The Daughter of Elf-king should have correct data', async function () {
      this.timeout(30000);
      const movieInfo = await getIMDBMovieInfo({ englishTitle: "Ireesha, The Daughter of Elf-king", releaseDate: '2020-07-24' });
      movieInfo.should.have.property("imdbID", "tt11052142");
      movieInfo.should.have.property("imdbRating").above(6);
    });

    it('get Girl’s Revenge should return null', async function () {
      this.timeout(30000);
      const movieInfo = await getIMDBMovieInfo({ englishTitle: "Girl’s Revenge", releaseDate: '2020-08-07' });
      movieInfo.should.have.property("imdbID", "tt13388018");
      movieInfo.should.have.property("imdbRating").above(3);
    });

    it('get Memento should have correct data', async function () {
      this.timeout(30000);
      const movieInfo = await getIMDBMovieInfo({ englishTitle: "Memento", releaseDate: '2020-08-05' });
      movieInfo.should.have.property("imdbID", "tt0209144");
      movieInfo.should.have.property("imdbRating").above(7);
    });
    
    it('get imdb rating should have correct data', async function () {
      this.timeout(30000);
      const rating = await getIMDBRating("tt12619256");
      rating.length.should.above(0);
    });
  });
});