"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const yahooMovieSchduleCrawler_1 = require("../crawler/yahooMovieSchduleCrawler");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('yahooMovieSchduleCrawler', () => {
    describe('crawyahooMovieSchdule', () => {
        it.skip('should correctly get new data from yahoo', function () {
            this.timeout(60000);
            return yahooMovieSchduleCrawler_1.default("6707").should.eventually.have.length.above(0);
        });
    });
});
//# sourceMappingURL=yahooMovieScheduleCrawler.test.js.map