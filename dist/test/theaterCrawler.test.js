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
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
const theaterCrawler_1 = require("../crawler/theaterCrawler");
chai.use(sinonChai);
const should = chai.should();
function hello(name, cb) {
    cb("hello " + name);
}
describe("hello", function () {
    it("should call callback with correct greeting", function () {
        var cb = sinon.spy();
        hello("foo", cb);
        cb.should.have.been.calledWith("hello foo");
    });
});
describe('theaterCrawler', () => {
    describe('getTheaterListByRegion(18)', () => {
        it('length.should.eq(1)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(10000);
                let theaterList = yield theaterCrawler_1.getTheaterListByRegion({ yahooRegionId: 18 });
                theaterList.length.should.eq(1);
            });
        });
    });
    describe('getTheaterList()', () => {
        it('length.should.above(0)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(10000);
                let theaterList = yield theaterCrawler_1.getTheaterList();
                theaterList.length.should.above(0);
            });
        });
    });
    describe('getRegionList()', () => {
        it('length.should.above(0)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(5000);
                let regionList = yield theaterCrawler_1.getRegionList();
                regionList.length.should.above(0);
            });
        });
    });
});
//# sourceMappingURL=theaterCrawler.test.js.map