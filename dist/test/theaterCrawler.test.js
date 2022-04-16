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
const chai_1 = require("chai");
const sinonChai = require("sinon-chai");
const theaterCrawler_1 = require("../crawler/theaterCrawler");
chai.use(sinonChai);
const should = chai.should();
describe('theaterCrawler', () => {
    describe('getTheaterListByRegion(a02)', () => {
        it('length.should.eq(1)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(20000);
                let theaterList = yield theaterCrawler_1.getTheaterListByRegion({ regionId: 'a01', name: "基隆" }, 1);
                chai_1.expect(theaterList[0]).contain({ "name": "基隆秀泰影城", "url": "https://www.showtimes.com.tw/events?corpId=5", "scheduleUrl": "/showtime/t02g04/a01/", "address": "基隆市中正區信一路177號", "phone": "(02)2421-2388", "region": "基隆", "regionIndex": 1, "subRegion": "基隆" });
                theaterList.length.should.eq(1);
            });
        });
    });
    describe('getRegionList()', () => {
        it('length.should.above(0)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(60000);
                let regionList = yield theaterCrawler_1.getRegionList();
                regionList.length.should.above(0);
            });
        });
    });
});
//# sourceMappingURL=theaterCrawler.test.js.map