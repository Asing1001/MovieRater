"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const db_1 = require("../data/db");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('db', () => {
    describe('connection', () => {
        it('db.openDbConnection().should.eventually.be.fulfilled', function () {
            this.timeout(5000);
            return db_1.db.openDbConnection().should.eventually.be.fulfilled;
        });
    });
    describe('getCollection', () => {
        it('get collection should success return array', function () {
            this.timeout(10000);
            return db_1.db.getCollection('test').should.eventually.have.property('map');
        });
    });
    describe('getDocument', () => {
        it('should.eventually.be.fulfilled', function () {
            this.timeout(10000);
            return db_1.db.getDocument({}, "test").should.eventually.be.fulfilled;
        });
    });
    describe('insertCollection', () => {
        it('should fulfilled when give empty array', () => db_1.db.insertCollection([], 'test').should.eventually.be.fulfilled);
    });
    describe('updateDocument', () => {
        it('should insert when target object not exist', () => {
            return db_1.db.updateDocument({ name: 'unitTest' }, { unitTest: 'test' }, 'test').should.eventually.be.fulfilled;
        });
        it('update with only property "unitTest2" should not override property "unitTest"', () => {
            return db_1.db.updateDocument({ name: 'unitTest' }, { unitTest2: 'test' }, 'test')
                .then(() => db_1.db.getDocument({ name: 'unitTest' }, 'test')).should.eventually.have.property('unitTest');
            ;
        });
        it('should updateDocument successfully', () => {
            return db_1.db.updateDocument({ name: 'unitTest' }, { page: 'test', article: [{ id: 123 }] }, 'test')
                .then(() => db_1.db.getDocument({ name: 'unitTest' }, 'test')).should.eventually.have.deep.property('article[0].id');
        });
        // import * as Q from 'Q';
        // it('This is db script to convert pttPages to pttArticles', function() {
        //   this.timeout(10000000);
        //   return db.getCollection('pttPages').then(pttPages => {
        //     let allArticles = [].concat(...pttPages.map(({articles}) => articles));
        //     let promises = db.insertCollection( allArticles, "pttArticles");
        //     return Q.all(promises).then(() => pttPages);
        //   })
        // })
    });
});
//# sourceMappingURL=db.test.js.map