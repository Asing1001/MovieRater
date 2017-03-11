"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var cacheManager_1 = require('../data/cacheManager');
var memoryCache = require('memory-cache');
var Q = require("q");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
var mockCacheManager = (function (_super) {
    __extends(mockCacheManager, _super);
    function mockCacheManager() {
        _super.apply(this, arguments);
    }
    mockCacheManager.init = function () {
        var defer = Q.defer();
        memoryCache.put(cacheManager_1.default.All_MOVIES, [1]);
        defer.resolve();
        return defer.promise;
    };
    return mockCacheManager;
}(cacheManager_1.default));
describe('cacheManager', function () {
    describe('init cacheManager', function () {
        it('should init complete', function () {
            return mockCacheManager.init().should.eventually.fulfilled;
        });
    });
    describe('get', function () {
        it('cacheManager', function () {
            return mockCacheManager.get(cacheManager_1.default.All_MOVIES).should.have.length.above(0);
        });
    });
});
//# sourceMappingURL=cacheManager.test.js.map