import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { db } from "../data/db";
import { updateMoviesSchedules } from '../task/atmoviesTask';
import * as movieSchduleCrawler from '../crawler/movieSchduleCrawler';
import * as redis from 'redis';

const should = chai.should();
const assert = chai.assert;

describe('atmovieInTheaterCrawler', () => {
    let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();    
  });

  afterEach(() => sandbox.restore());  
  describe('updateMoviesSchedules', () => {
    it.skip('should.above(0)', async function () {
      this.timeout(30000);
      // const yahooMovie: YahooMovie = { yahooId: 99999, chineseTitle: "測試" };
      const stubGetCollections = sandbox.stub(db, 'getCollection').returns([{ scheduleUrl: "/1/" }, { scheduleUrl: "/2/" }]);
      const stubGetDocument = sandbox.stub(db, 'getDocument').returns({ scheduleDay: 1 });
      const stubCrawlSchedule = sandbox.stub(movieSchduleCrawler, 'crawlMovieSchdule').returns([]);
      const schedules = await updateMoviesSchedules();
      sandbox.assert.callCount(stubCrawlSchedule, 2);
    });
  });
});