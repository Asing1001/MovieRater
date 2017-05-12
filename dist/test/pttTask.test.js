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
const pttTask_1 = require("../task/pttTask");
const pttCrawler = require("../crawler/pttCrawler");
const db_1 = require("../data/db");
chai.use(sinonChai);
describe('pttCrawler', () => {
    let sandbox, stubUpdateDocument;
    before(() => {
        sandbox = sinon.sandbox.create();
        stubUpdateDocument = sandbox.stub(db_1.db, 'updateDocument');
    });
    after(() => sandbox.restore());
    describe('updatePttArticles', () => {
        it('should get new pttArticles then updateDocument', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const pttPage = { pageIndex: 99999, url: 'http://ptt.test', articles: [{ title: "test", url: "http://article" }] };
                const stubGetDocument = sandbox.stub(db_1.db, 'getDocument').returns({ maxPttIndex: 9999 });
                const stubGetPttPage = sandbox.stub(pttCrawler, 'getPttPage').returns(Promise.resolve(pttPage));
                yield pttTask_1.updatePttArticles(3);
                //updateMaPttIndex + 3 new pttArticles = 4 call count
                sandbox.assert.callCount(stubUpdateDocument, 4);
                sandbox.assert.calledThrice(stubGetPttPage);
            });
        });
    });
});
//# sourceMappingURL=pttTask.test.js.map