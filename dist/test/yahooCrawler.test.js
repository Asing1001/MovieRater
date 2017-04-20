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
const yahooCrawler_1 = require("../crawler/yahooCrawler");
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiAsPromised);
describe('YahooCrawler', () => {
    describe('getYahooMovieInfo(10)', () => {
        it('.should.have.property("chineseTitle")', function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(30000);
                const yahooMovie = yield yahooCrawler_1.getYahooMovieInfo(10);
                yahooMovie.should.have.property('chineseTitle');
            });
        });
    });
    describe('getYahooMovieInfo(9999)', () => {
        it('.should.eventually.be.rejected', function () {
            this.timeout(30000);
            return yahooCrawler_1.getYahooMovieInfo(9999).should.eventually.be.rejected;
        });
    });
});
//# sourceMappingURL=yahooCrawler.test.js.map