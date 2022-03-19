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
const chaiAsPromised = require("chai-as-promised");
const pttCrawler_1 = require("../crawler/pttCrawler");
const cacheManager_1 = require("../data/cacheManager");
chai.use(chaiAsPromised);
chai.should();
describe('pttCrawler', () => {
    describe('getMatchedYahooId', () => {
        before(() => {
            const testMoviesData = [{
                    "yahooId": 6571,
                    "chineseTitle": "羅根",
                    "englishTitle": "Logan",
                    "releaseDate": "2017-02-28",
                }, {
                    "yahooId": 999999,
                    "chineseTitle": "chineseTitle",
                    "englishTitle": "englishTitle",
                    "releaseDate": "2013-02-28",
                }];
            cacheManager_1.default.set(cacheManager_1.default.All_MOVIES, testMoviesData);
            return;
        });
        it('should find match yahooId 6571', function () {
            return pttCrawler_1.getMatchedYahooId("[普雷] 羅根 (原來還蠻血腥的)", "2017/03/14").should.equal(6571);
        });
    });
    describe('getPttPage', () => {
        it('should reject when Pttid not exist', function () {
            this.timeout(5000);
            let pageIndex = 99999;
            return pttCrawler_1.getPttPage(pageIndex).should.eventually
                .rejectedWith(`index${pageIndex} not exist, server return:404 - Not Found.`);
        });
        it('should resolve when Pttid exist', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(5000);
                const pttPage = yield pttCrawler_1.getPttPage(4000);
                pttPage.articles.length.should.greaterThan(0);
            });
        });
    });
});
//# sourceMappingURL=pttCrawler.test.js.map