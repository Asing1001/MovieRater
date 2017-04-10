import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getIMDBMovieInfo } from '../crawler/imdbCrawler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('imdbCrawler', () => {
  describe('getIMDBMovieInfo', () => {
    it('getIMDBMovieInfo("Who Killed Cock Robin").should.have.property("imdbID","tt5576318"),"imdbRating".above(7)', async function () {
      this.timeout(10000);
      const movieInfo = await getIMDBMovieInfo("Who Killed Cock Robin");
      movieInfo.should.have.property("imdbID","tt5576318");
      movieInfo.should.have.property("imdbRating").above(7);
    });
  });
});