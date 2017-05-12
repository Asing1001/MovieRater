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

  describe('getMoviesSchedulesWithLocation', () => {
    it('should has binding theaterExtension', async function () {      
      //Arrange
      const allSchedules: Schedule[] = new Array<Schedule>(new Schedule(0, "台南新光影城", ));
      const theaterWithLocation = {
        "name": "台南新光影城",
        "url": "https://tw.movies.yahoo.com/theater_result.html/id=69",
        "address": "台南市中西區西門路一段658號8樓",
        "phone": "06-3031260",
        "location": {
          "lat": 22.9868277,
          "lng": 120.1977034,
          "place_id": "ChIJGyl13nt2bjQRgqfRajWQWC8"
        },
        "region": "台南"
      }

      sandbox.stub(db, 'getCollection').returns(Promise.resolve([theaterWithLocation]));

      //Act
      const allSchedulesWithLocation = await getMoviesSchedulesWithLocation(allSchedules);

      //Assert
      const validateResult: Schedule[] = allSchedulesWithLocation;
      validateResult[0].theaterExtension.should.eql(theaterWithLocation);

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