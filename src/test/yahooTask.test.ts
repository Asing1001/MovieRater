import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { db } from "../data/db";
import { updateTheaterList, updateYahooMovies } from '../task/yahooTask';
import Theater from '../models/theater';
import YahooMovie from '../models/yahooMovie';
import * as theaterCrawler from '../crawler/theaterCrawler';
import * as yahooCrawler from '../crawler/yahooCrawler';

const should = chai.should();
chai.use(sinonChai);

describe('yahooTask', () => {
  let sandbox: sinon.SinonSandbox, stubUpdateDocument;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    stubUpdateDocument = sandbox.stub(db, 'updateDocument');
  });

  afterEach(() => sandbox.restore());

  describe('updateTheaterList', () => {
    it('should get theater list then updateDocument', async function () {
      const stubGetTheaterList = sandbox.stub(theaterCrawler, 'getTheaterList').returns([1]);
      await updateTheaterList();
      sandbox.assert.calledOnce(stubUpdateDocument);
      sandbox.assert.calledOnce(stubGetTheaterList);
    });
  });

  describe('updateYahooMovies', () => {
    it('should get newYahooMovies then updateDocument', async function () {
      const yahooMovie: YahooMovie = { yahooId: 99999, chineseTitle: "測試" };
      const stubGetDocument = sandbox.stub(db, 'getDocument').returns({ maxYahooId: 9999 });
      const stubGetYahooMovieInfo = sandbox.stub(yahooCrawler, 'getYahooMovieInfo').returns(Promise.resolve(yahooMovie));
      await updateYahooMovies(3);
      //updateMaxYahooId + 3 new yahooMovies = 4 call count
      sandbox.assert.callCount(stubUpdateDocument, 4);
      sandbox.assert.calledThrice(stubGetYahooMovieInfo);
    });
  });
});