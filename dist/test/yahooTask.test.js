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
const theaterCrawler = require("../crawler/theaterCrawler");
const yahooCrawler = require("../crawler/yahooCrawler");
const should = chai.should();
chai.use(sinonChai);
describe('yahooTask', () => {
    let sandbox, stubUpdateDocument;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        stubUpdateDocument = sandbox.stub(db_1.db, 'updateDocument');
    });
    afterEach(() => sandbox.restore());
    describe('updateTheaterList', () => {
        it('should get theater list then updateDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const stubGetTheaterList = sandbox.stub(theaterCrawler, 'getTheaterList').returns([1]);
                yield yahooTask_1.updateTheaterList();
                sandbox.assert.calledOnce(stubUpdateDocument);
                sandbox.assert.calledOnce(stubGetTheaterList);
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