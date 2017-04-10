"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const db_1 = require("../data/db");
const task_1 = require("../backgroundService/task");
const theaterCrawler = require("../crawler/theaterCrawler");
const should = chai.should();
chai.use(sinonChai);
describe('task', () => {
    let sandbox, stubUpdateDocument;
    before(() => {
        sandbox = sinon.sandbox.create();
        stubUpdateDocument = sandbox.stub(db_1.db, 'updateDocument');
    });
    after(() => sandbox.restore());
    describe('updateTheaterList', () => {
        it('should get theater list then updateDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const stubGetTheaterList = sandbox.stub(theaterCrawler, 'getTheaterList').returns([1]);
                yield task_1.updateTheaterList();
                sandbox.assert.calledOnce(stubUpdateDocument);
                sandbox.assert.calledOnce(stubGetTheaterList);
            });
        });
    });
});
//# sourceMappingURL=task.test.js.map