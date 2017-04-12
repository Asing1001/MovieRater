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
    before(() => {
        sandbox = sinon.sandbox.create();
        stubUpdateDocument = sandbox.stub(db_1.db, 'updateDocument');
        stubGetCollection = sandbox.stub(db_1.db, 'getCollection');
    });
    after(() => {
        sandbox.restore();
    });
    describe('updateImdbInfo', () => {
        it("should get yahooMovies then update nearly movies' imdb info", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const yahooMovies = [{
                        yahooId: 6777,
                        englishTitle: 'Dangal',
                        releaseDate: moment().format(),
                        imdbLastCrawlTime: moment().subtract(2, 'days').format()
                    }];
                stubGetCollection.returns(yahooMovies);
                const stubGetIMDBMovieInfo = sandbox.stub(imdbCrawler, 'getIMDBMovieInfo').returns([1]);
                yield imdbTask_1.updateImdbInfo();
                sandbox.assert.calledOnce(stubUpdateDocument);
            });
        });
    });
});
//# sourceMappingURL=imdbTask.test.js.map