import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getPlayingMovies } from '../crawler/lineCrawler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('lineCrawler', () => {
  describe('getPlayingMovies', () => {
    it('should fetch and return playing movies', async function () {
      this.timeout(30000);
      const movieInfo = await getPlayingMovies();
      expect(movieInfo).to.be.an('object');
      expect(movieInfo.id).to.be.a('string');
      expect(movieInfo.totalCount).to.be.a('number');
      expect(movieInfo.items).to.be.an('array');
      expect(movieInfo.items.length).to.be.greaterThan(0);
    });
  });
});