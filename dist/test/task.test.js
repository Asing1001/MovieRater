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
const db_1 = require("../data/db");
const should = chai.should();
describe('task', () => {
    describe('updateTheaterList', () => {
        before(() => { return db_1.db.openDbConnection(); });
        // should not do real update db in unit test
        // it('should successful in 5 sec', async function () {
        //   this.timeout(5000);
        //   await updateTheaterList();
        //   return;
        // });
        it('db should have theaters length > 0', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let theaters = yield db_1.db.getCollection('theaters');
                theaters.length.should.above(0);
            });
        });
    });
});
//# sourceMappingURL=task.test.js.map