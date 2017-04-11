import * as moment from 'moment';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { db } from "../data/db";
import { updateImdbInfo } from '../task/imdbTask';
import * as imdbCrawler from '../crawler/imdbCrawler';
import Movie from "../models/movie";

const should = chai.should();
chai.use(sinonChai);

describe('task', () => {
  let sandbox, stubUpdateDocument, stubGetCollection: sinon.SinonStub;
  before(() => {
    sandbox = sinon.sandbox.create();
    stubUpdateDocument = sandbox.stub(db, 'updateDocument');
    stubGetCollection = sandbox.stub(db, 'getCollection');
  });

  after(() => {
    sandbox.restore();
  });

  describe('updateImdbInfo', () => {
    it("should get yahooMovies then update nearly movies' imdb info", async function () {
      const yahooMovies: Movie[] = [{
        yahooId: 6777,
        englishTitle: 'Dangal',
        releaseDate: moment().format(),
        imdbLastCrawlTime: moment().subtract(2, 'days').format()
      }]
      stubGetCollection.returns(yahooMovies);
      const stubGetIMDBMovieInfo = sandbox.stub(imdbCrawler, 'getIMDBMovieInfo').returns([1]);
      await updateImdbInfo();
      sandbox.assert.calledOnce(stubUpdateDocument);
    });
  });
});