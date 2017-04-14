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
const moment = require("moment");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const db_1 = require("../data/db");
const imdbTask_1 = require("../task/imdbTask");
const imdbCrawler = require("../crawler/imdbCrawler");
const should = chai.should();
chai.use(sinonChai);
describe('imdbTask', () => {
    let sandbox, stubUpdateDocument, stubGetCollection;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        stubUpdateDocument = sandbox.stub(db_1.db, 'updateDocument');
        stubGetCollection = sandbox.stub(db_1.db, 'getCollection');
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe('updateImdbInfo', () => {
        const yahooMovie = {
            yahooId: 6777,
            englishTitle: 'Dangal',
            releaseDate: moment().format(),
            imdbLastCrawlTime: moment().subtract(2, 'days').format()
        };
        it("One yahooMovie should called GetIMDBMovieInfo Once", function () {
            return __awaiter(this, void 0, void 0, function* () {
                stubGetCollection.returns([yahooMovie]);
                const stubGetIMDBMovieInfo = sandbox.stub(imdbCrawler, 'getIMDBMovieInfo').returns({ imdbID: "", imdbRating: "" });
                yield imdbTask_1.updateImdbInfo();
                sandbox.assert.calledOnce(stubGetIMDBMovieInfo);
            });
        });
        it("should update db without info when it's empty", function () {
            return __awaiter(this, void 0, void 0, function* () {
                stubGetCollection.returns([yahooMovie]);
                const stubGetIMDBMovieInfo = sandbox.stub(imdbCrawler, 'getIMDBMovieInfo').returns({ imdbID: "", imdbRating: "" });
                yield imdbTask_1.updateImdbInfo();
                sandbox.assert.calledWith(stubUpdateDocument, { yahooId: yahooMovie.yahooId }, { yahooId: yahooMovie.yahooId, imdbLastCrawlTime: moment().format('YYYY-MM-DDTHH') });
            });
        });
    });
});
//# sourceMappingURL=imdbTask.test.js.map