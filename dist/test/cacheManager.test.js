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
const cacheManager_1 = require("../data/cacheManager");
const db_1 = require("../data/db");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(sinonChai);
describe('cacheManager', () => {
    let sandbox, stubGetCollection;
    before(() => {
        sandbox = sinon.sandbox.create();
        stubGetCollection = sandbox.stub(db_1.db, 'getCollection');
    });
    after(() => {
        sandbox.restore();
    });
    describe('init cacheManager', () => {
        it('should init complete', function () {
            return __awaiter(this, void 0, void 0, function* () {
                stubGetCollection.returns([]);
                sandbox.stub(cacheManager_1.default, 'setRecentMoviesCache').returns(Promise.resolve([]));
                sandbox.stub(cacheManager_1.default, 'setMoviesSchedulesCache').returns(Promise.resolve([]));
                yield cacheManager_1.default.init();
            });
        });
    });
});
//# sourceMappingURL=cacheManager.test.js.map