import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { db } from "../data/db";
import { systemSetting } from '../configs/systemSetting';
import cacheManager from '../data/cacheManager';
import * as memoryCache from 'memory-cache';
import * as Q from "q";

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

class mockCacheManager extends cacheManager {
  static init() {
    let defer = Q.defer<void>();
    memoryCache.put(cacheManager.All_MOVIES, [1]);
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
      return mockCacheManager.get(cacheManager.All_MOVIES).should.have.length.above(0)
    });
  });

  describe('setRecentMoviesCache', () => {
    it('should.eventually.fulfilled', function () {
      this.timeout(10000);
      return mockCacheManager.setRecentMoviesCache().should.eventually.fulfilled;
    });
  });
});