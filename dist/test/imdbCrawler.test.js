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
const imdbCrawler_1 = require("../crawler/imdbCrawler");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);
describe('imdbCrawler', () => {
    describe('getIMDBMovieInfo', () => {
        it('getIMDBMovieInfo("Who Killed Cock Robin").should.have.property("imdbID","tt5576318"),"imdbRating".above(7)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(30000);
                const movieInfo = yield imdbCrawler_1.getIMDBMovieInfo("Who Killed Cock Robin");
                movieInfo.should.have.property("imdbID", "tt5576318");
                movieInfo.should.have.property("imdbRating").above(6);
            });
        });
        it('getIMDBMovieInfo(" A Silent Voice : The Movie").should.have.property("imdbID","tt5323662"),"imdbRating".above(7)', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(30000);
                const movieInfo = yield imdbCrawler_1.getIMDBMovieInfo(" A Silent Voice : The Movie");
                movieInfo.should.have.property("imdbID", "tt5323662");
                movieInfo.should.have.property("imdbRating").above(7);
            });
        });
    });
});
//# sourceMappingURL=imdbCrawler.test.js.map