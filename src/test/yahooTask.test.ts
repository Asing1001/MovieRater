import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { db } from "../data/db";
import { getMoviesSchedulesWithLocation, updateYahooMovies } from '../task/yahooTask';
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
    stubUpdateDocument = sandbox.stub(db, 'updateDocument');
  });

  afterEach(() => sandbox.restore());

  describe('getTheaterWithLocationList', () => {
    it('should has binding theaterExtension', async function () {
      //Arrange
      const allSchedules: Schedule[] = new Array<Schedule>(new Schedule(0, "京站威秀影城", ));
      const expetedTheater = new Theater("京站威秀影城", "台北市大同區市民大道一段209號5樓");
      const expetedLocation = new Location("123", "456", "789");

      sandbox.stub(theaterCrawler, 'getTheaterList').returns(Promise.resolve([expetedTheater]));
      sandbox.stub(googleMapApi, 'getGeoLocation').returns(Promise.resolve(expetedLocation));

      //Act
      const allSchedulesWithLocation = await getMoviesSchedulesWithLocation(allSchedules);

      //Assert
      const validateResult: Schedule[] = allSchedulesWithLocation;
      validateResult[0].theaterExtension.should.eql(expetedTheater);
      validateResult[0].theaterExtension.location.should.eql(expetedLocation);

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