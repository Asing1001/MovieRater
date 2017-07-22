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
const ezCrawler_1 = require("../crawler/ezCrawler");
const should = chai.should();
const assert = chai.assert;
describe('ezCrawler', () => {
    // describe('getAllSchedules', () => {
    //   it('should.above(0)', async function () {
    //     this.timeout(30000);
    //     const theaters = await getAllTheaterWithSchedules();
    //     // theaters.map(({}))
    //     theaters.length.should.above(0);
    //   });
    // });
    describe('getAllTheaters', () => {
        it('should.above(0)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(30000);
                const theaters = yield ezCrawler_1.getAllTheaters();
                theaters.length.should.above(0);
            });
        });
    });
    // describe('getMoviesByCinemaId', () => {
    //   it('should.above(0)', async function () {
    //     this.timeout(30000);
    //     const movies = await getMoviesByCinemaId('73544d843cd311e69bb83d0f96c001c2');
    //     movies.length.should.above(0);
    //   });
    // });
    // describe('getShowDatesByCinemaIdAndMovieId', () => {
    //   it('should.above(0)', async function () {
    //     this.timeout(30000);
    //     const movies = await getShowDatesByCinemaIdAndMovieId('73544d843cd311e69bb83d0f96c001c2', '14554643a4674dda925eded0d33863e5');
    //     movies.length.should.above(0);
    //   });
    // });
    // describe('getShowDatesByCinemaIdAndMovieId', () => {
    //   it('should.above(0)', async function () {
    //     this.timeout(30000);
    //     const movies = await getShowTimes('5f60dacd-45b3-102d-8d74-e400529c',
    //       '67c7371dcb3f47cd90cf6268273493a1', '2017/07/18');
    //     movies.length.should.above(0);
    //   });
    // });
});
//# sourceMappingURL=ezCrawler.test.js.map