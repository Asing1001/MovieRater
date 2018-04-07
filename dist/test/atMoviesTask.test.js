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
const db_1 = require("../data/db");
const atmoviesTask_1 = require("../task/atmoviesTask");
const movieSchduleCrawler = require("../crawler/movieSchduleCrawler");
const should = chai.should();
const assert = chai.assert;
describe('atmovieInTheaterCrawler', () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });
    afterEach(() => sandbox.restore());
    describe('updateMoviesSchedules', () => {
        it.skip('should.above(0)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(30000);
                // const yahooMovie: YahooMovie = { yahooId: 99999, chineseTitle: "測試" };
                const stubGetCollections = sandbox.stub(db_1.db, 'getCollection').returns([{ scheduleUrl: "/1/" }, { scheduleUrl: "/2/" }]);
                const stubGetDocument = sandbox.stub(db_1.db, 'getDocument').returns({ scheduleDay: 1 });
                const stubCrawlSchedule = sandbox.stub(movieSchduleCrawler, 'crawlMovieSchdule').returns([]);
                const schedules = yield atmoviesTask_1.updateMoviesSchedules();
                sandbox.assert.callCount(stubCrawlSchedule, 2);
            });
        });
    });
});
//# sourceMappingURL=atMoviesTask.test.js.map