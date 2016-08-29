import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {db} from '../db';
import {systemSetting} from '../configs/systemSetting';

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

  describe('insertCollection', () => {
    it('should resolve when give empty array', () => db.insertCollection([], 'test').should.be.fulfilled);
  });

  describe('updateDocument', () => {
    it('should resolve when update object not exist', () => db.updateDocument({ name: 'crawlerStatus' }, { yahooId: 68, test: 123 }, 'configs').should.be.fulfilled)
  });
});
