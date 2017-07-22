import * as chai from 'chai';
import { getInTheaterYahooIds } from '../crawler/yahooInTheaterCrawler';

const should = chai.should();
const assert = chai.assert;

describe('yahooInTheaterCrawler', () => {
  describe('getInTheaterYahooIds', () => {
    it.skip('should.above(0)', async function () {
      this.timeout(30000);
      const yahooIds = await getInTheaterYahooIds();
      yahooIds.length.should.above(0);
      assert.isFalse(isNaN(yahooIds[0]));
    });
  });
});