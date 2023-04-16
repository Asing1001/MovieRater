import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { Mongo } from '../data/db';
import { updateYahooMovies } from '../task/yahooTask';
import * as googleMapApi from '../thirdPartyIntegration/googleMapApi';
import Location from '../models/location';
import Theater from '../models/theater';
import YahooMovie from '../models/yahooMovie';
import * as theaterCrawler from '../crawler/theaterCrawler';
import * as yahooCrawler from '../crawler/yahooCrawler';
import Schedule from '../models/schedule';

const should = chai.should();
chai.use(sinonChai);

describe('yahooTask', () => {
  let sandbox: sinon.SinonSandbox, stubUpdateDocument;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    stubUpdateDocument = sandbox.stub(Mongo, 'updateDocument');
  });

  afterEach(() => sandbox.restore());

  describe('updateYahooMovies', () => {
    it('should get newYahooMovies then updateDocument', async function () {
      const yahooMovie: YahooMovie = { yahooId: 99999, chineseTitle: '測試' };
      const stubGetDocument = sandbox
        .stub(Mongo, 'getDocument')
        .returns({ maxYahooId: 9999 });
      const stubGetYahooMovieInfo = sandbox
        .stub(yahooCrawler, 'getYahooMovieInfo')
        .returns(Promise.resolve(yahooMovie));
      await updateYahooMovies(3);
      //updateMaxYahooId + 3 new yahooMovies = 4 call count
      sandbox.assert.callCount(stubUpdateDocument, 4);
      sandbox.assert.calledThrice(stubGetYahooMovieInfo);
    });
  });
});
