import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {db} from "../data/db";
import {systemSetting} from '../configs/systemSetting'; 
import cacheManager from '../data/cacheManager';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);


describe('cacheManager', () => {
before(()=>{return db.openDbConnection(systemSetting.dbUrl)})
  describe('init cacheManager', () => {
    it('should init complete', function () {
      this.timeout(30000);
      return cacheManager.init().should.eventually.fulfilled
    });
  });
  
  describe('getAllMovies', () => {
    it('should correctly get data from cacheManager', function () {
      return cacheManager.get('allMovies').should.have.length.above(0)
    });
  });
});