import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { db } from "../data/db";
import { systemSetting } from '../configs/systemSetting';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('db', () => {
  describe('connection', () => {
    it('should not null when connection string is correct', function () {
      this.timeout(5000);
      return db.openDbConnection(systemSetting.dbUrl).should.eventually.fulfilled
    });
  });

  describe('getCollection', () => {
    it('get yahooMovie collection should return length above 0', function () {
      this.timeout(10000);
      return db.getCollection('yahooMovies').should.eventually.have.length.above(0)
    });
  });

  describe('insertCollection', () => {
    it('should resolve when give empty array', () => db.insertCollection([], 'test').should.eventually.fulfilled);
  });

  describe('updateDocument', () => {
    it('should resolve when update object not exist', () => db.updateDocument({ name: 'crawlerStatus' }, { unitTest: 'test' }, 'configs').should.eventually.fulfilled)
  });
});
