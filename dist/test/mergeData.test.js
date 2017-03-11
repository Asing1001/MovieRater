"use strict";
var mergeData_1 = require('../crawler/mergeData');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('mergeData', function () {
    describe('mergeData', function () {
        it('should not merge if chineseTitle match but article date not in range', function () {
            var yahooMovies = [{ yahooId: 1, chineseTitle: '測試資料1', releaseDate: '2016-11-07' }];
            var pttPages = [{
                    "articles": [
                        {
                            "title": "[好雷] 測試資料1",
                            "url": "https://www.ptt.cc/bbs/movie/M.1472305062.A.807.html",
                            "date": "2016/06/06"
                        }]
                }];
            var actual = mergeData_1.mergeData(yahooMovies, pttPages);
            assert.equal(JSON.stringify(actual[0].relatedArticles), JSON.stringify([]));
        });
        it('should merge if chineseTitle match and article date in range', function () {
            var yahooMovies = [{ yahooId: 1, chineseTitle: '測試', releaseDate: '2016-09-07' }];
            var pttPages = [{
                    "articles": [
                        {
                            "title": "[好雷] 測試資料",
                            "url": "https://www.ptt.cc/bbs/movie/M.1472305062.A.807.html",
                            "date": "2016/08/07"
                        }]
                }];
            var actual = mergeData_1.mergeData(yahooMovies, pttPages);
            assert.equal(JSON.stringify(actual[0].relatedArticles), JSON.stringify(pttPages[0].articles));
        });
    });
});
//# sourceMappingURL=mergeData.test.js.map