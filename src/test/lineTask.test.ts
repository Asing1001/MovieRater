import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { updateLINEMovies } from '../task/lineTask';
import { Mongo } from '../data/db';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('lineTask', () => {
  before(async () => {
    await Mongo.openDbConnection();
  });
  describe('Update Movies', () => {
    it('should without error', async function () {
      this.timeout(30000);
      const movies = await updateLINEMovies();
      // Assuming movies[0] is an object with a lineTrailerHash property
      expect(movies.pop().lineTrailerHash).to.be.not.null; // Use "to.be.null" instead of "is.null"
    });
  });
});
