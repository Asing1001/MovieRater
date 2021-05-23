import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { getHtmlOfNetflixMovieWithRatingInfo } from '../crawler/netlixCrawler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);

describe('NetflixCrawler', () => {
  describe('getHtmlOfNetflixMovieWithRatingInfo()', () => {
    it('invoke func should not return null', async function () {
      this.timeout(300000);
      const html = await getHtmlOfNetflixMovieWithRatingInfo();
      assert.isTrue(!!html);
    });
  });
});