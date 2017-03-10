"use strict";
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var db_1 = require("../data/db");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('db', function () {
    describe('connection', function () {
        it('should not null when connection string is correct', function () {
            this.timeout(5000);
            return db_1.db.openDbConnection().should.eventually.be.fulfilled;
        });
    });
    describe('getCollection', function () {
        it('get collection should success return array', function () {
            this.timeout(10000);
            return db_1.db.getCollection('test').should.eventually.have.property('map');
        });
    });
    describe('getDocument', function () {
        it('get Document should success', function () {
            this.timeout(10000);
            return db_1.db.getDocument({}, "test").should.eventually.be.fulfilled;
        });
    });
    describe('insertCollection', function () {
        it('should resolve when give empty array', function () { return db_1.db.insertCollection([], 'test').should.eventually.be.fulfilled; });
    });
    describe('updateDocument', function () {
        it('should resolve when update object not exist', function () {
            return db_1.db.updateDocument({ name: 'unitTest' }, { unitTest: 'test' }, 'test').should.eventually.be.fulfilled;
        });
    });
});
//# sourceMappingURL=db.test.js.map