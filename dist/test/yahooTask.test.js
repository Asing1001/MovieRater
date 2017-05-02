"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const db_1 = require("../data/db");
const yahooTask_1 = require("../task/yahooTask");
const yahooCrawler = require("../crawler/yahooCrawler");
const schedule_1 = require("../models/schedule");
const should = chai.should();
chai.use(sinonChai);
describe('yahooTask', () => {
    let sandbox, stubUpdateDocument;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        stubUpdateDocument = sandbox.stub(db_1.db, 'updateDocument');
    });
    afterEach(() => sandbox.restore());
    describe('getMoviesSchedulesWithLocation', () => {
        it('should has binding theaterExtension', function () {
            return __awaiter(this, void 0, void 0, function* () {
                //Arrange
                const allSchedules = new Array(new schedule_1.default(0, "台南新光影城"));
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
                };
                sandbox.stub(db_1.db, 'getCollection').returns(Promise.resolve([theaterWithLocation]));
                //Act
                const allSchedulesWithLocation = yield yahooTask_1.getMoviesSchedulesWithLocation(allSchedules);
                //Assert
                const validateResult = allSchedulesWithLocation;
                validateResult[0].theaterExtension.should.eql(theaterWithLocation);
            });
        });
    });
    describe('updateYahooMovies', () => {
        it('should get newYahooMovies then updateDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const yahooMovie = { yahooId: 99999, chineseTitle: "測試" };
                const stubGetDocument = sandbox.stub(db_1.db, 'getDocument').returns({ maxYahooId: 9999 });
                const stubGetYahooMovieInfo = sandbox.stub(yahooCrawler, 'getYahooMovieInfo').returns(Promise.resolve(yahooMovie));
                yield yahooTask_1.updateYahooMovies(3);
                //updateMaxYahooId + 3 new yahooMovies = 4 call count
                sandbox.assert.callCount(stubUpdateDocument, 4);
                sandbox.assert.calledThrice(stubGetYahooMovieInfo);
            });
        });
    });
});
//# sourceMappingURL=yahooTask.test.js.map