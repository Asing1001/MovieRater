import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { db } from "../data/db";

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('db', () => {
  describe('connection', () => {
    it('should not null when connection string is correct', function () {
      this.timeout(5000);
      return db.openDbConnection().should.eventually.be.fulfilled
    });
  });

  describe('getCollection', () => {
    it('get collection should success return array', function () {
      this.timeout(10000);
      return db.getCollection('test').should.eventually.have.property('map')
    });
  });

  describe('getDocument', () => {
    it('get Document should success', function () {
      this.timeout(10000);
      return db.getDocument({},"test").should.eventually.be.fulfilled
    });
  });

  describe('insertCollection', () => {
    it('should resolve when give empty array', () => db.insertCollection([], 'test').should.eventually.be.fulfilled);
  });

  describe('updateDocument', () => {
    it('should resolve when update object not exist', () => {
      return db.updateDocument({ name: 'unitTest' }, { unitTest: 'test' }, 'test').should.eventually.be.fulfilled
    })
  });
});
