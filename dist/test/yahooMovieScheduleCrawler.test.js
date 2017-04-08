"use strict";
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var yahooMovieSchduleCrawler_1 = require('../crawler/yahooMovieSchduleCrawler');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('yahooMovieSchduleCrawler', function () {
    describe('crawyahooMovieSchdule', function () {
        it('should correctly get new data from yahoo', function () {
            this.timeout(60000);
            return yahooMovieSchduleCrawler_1.default("6707").should.eventually.have.length.above(0);
        });
    });
});
//# sourceMappingURL=yahooMovieScheduleCrawler.test.js.map