import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { updateLINEMovies } from '../task/lineTask';
import { Mongo } from '../data/db';

const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);

const liveIt = process.env.ENABLE_LIVE_CRAWLER_TESTS === 'true' ? it : it.skip;

describe('lineTask', () => {
  before(async function () {
    if (process.env.ENABLE_LIVE_CRAWLER_TESTS !== 'true') return;
    await Mongo.openDbConnection();
  });

  after(() => {
    Mongo.closeDbConnection();
  });

  describe('Update Movies', () => {
    liveIt('should update LINE movies without error', async function () {
      this.timeout(30000);
      const movies = await updateLINEMovies();
      expect(movies.pop().lineTrailerHash).to.be.not.null;
    });
  });
});
