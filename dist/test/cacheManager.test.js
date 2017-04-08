"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const cacheManager_1 = require("../data/cacheManager");
const memoryCache = require("memory-cache");
const Q = require("q");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
class mockCacheManager extends cacheManager_1.default {
    static init() {
        let defer = Q.defer();
        memoryCache.put(cacheManager_1.default.All_MOVIES, [1]);
        defer.resolve();
        return defer.promise;
    }
}
describe('cacheManager', () => {
    describe('init cacheManager', () => {
        it('should init complete', function () {
            return mockCacheManager.init().should.eventually.fulfilled;
        });
    });
    describe('get', () => {
        it('cacheManager', function () {
            return mockCacheManager.get(cacheManager_1.default.All_MOVIES).should.have.length.above(0);
        });
    });
    describe('setRecentMoviesCache', () => {
        it('should.eventually.fulfilled', function () {
            this.timeout(10000);
            return mockCacheManager.setRecentMoviesCache().should.eventually.fulfilled;
        });
    });
});
//# sourceMappingURL=cacheManager.test.js.map