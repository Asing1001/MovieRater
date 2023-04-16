import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Mongo } from '../data/db';

chai.should();
chai.use(chaiAsPromised);

describe('db', () => {
  describe('connection', () => {
    it('db.openDbConnection().should.eventually.be.fulfilled', function () {
      this.timeout(5000);
      return Mongo.openDbConnection().should.eventually.be.fulfilled;
    });
  });

  describe('getCollection', () => {
    it('get collection should success return array', function () {
      this.timeout(10000);
      return Mongo.getCollection({
        name: 'test',
      }).should.eventually.have.property('map');
    });
  });

  describe('getDocument', () => {
    it('should.eventually.be.fulfilled', function () {
      this.timeout(10000);
      return Mongo.getDocument({}, 'test').should.eventually.be.fulfilled;
    });
  });

  describe('updateDocument', () => {
    it('should insert when target object not exist', () => {
      return Mongo.updateDocument(
        { name: 'unitTest' },
        { unitTest: 'test' },
        'test'
      ).should.eventually.be.fulfilled;
    });

    it('update with only property "unitTest2" should not override property "unitTest"', () => {
      return Mongo.updateDocument(
        { name: 'unitTest' },
        { unitTest2: 'test' },
        'test'
      )
        .then(() => Mongo.getDocument({ name: 'unitTest' }, 'test'))
        .should.eventually.have.property('unitTest');
    });

    it('should updateDocument successfully', () => {
      return Mongo.updateDocument(
        { name: 'unitTest' },
        { page: 'test', article: [{ id: 123 }] },
        'test'
      )
        .then(() => Mongo.getDocument({ name: 'unitTest' }, 'test'))
        .should.eventually.have.deep.property('article[0].id');
    });
  });
});
