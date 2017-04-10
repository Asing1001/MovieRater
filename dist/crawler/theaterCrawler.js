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
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const FormData = require("form-data");
const theaterListUrl = 'https://tw.movies.yahoo.com/theater_list.html';
function getTheaterList() {
    return __awaiter(this, void 0, void 0, function* () {
        const regionList = yield getRegionList();
        const promises = regionList.map(getTheaterListByRegion);
        const theaterList = [].concat(...(yield Promise.all(promises)));
        return theaterList;
    });
}
exports.getTheaterList = getTheaterList;
function getTheaterListByRegion({ yahooRegionId }) {
    return __awaiter(this, void 0, void 0, function* () {
        var form = new FormData();
        form.append('area', yahooRegionId);
        const request = new Request(theaterListUrl, {
            method: 'POST',
            body: form
        });
        const $ = yield get$(request);
        const theaterList = Array.from($('#ymvthl tbody>tr')).map(theaterRow => {
            const $theaterRow = $(theaterRow);
            const theater = {
                name: $theaterRow.find('a').text(),
                url: $theaterRow.find('a').attr('href'),
                address: $theaterRow.find('td:nth-child(2)').contents()[0].nodeValue,
                phone: $theaterRow.find('em').text(),
            };
            return theater;
        });
        return theaterList;
    });
}
exports.getTheaterListByRegion = getTheaterListByRegion;
function getRegionList() {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = yield get$(theaterListUrl);
        const regionList = Array.from($('#area>option')).map((option) => {
            const $option = $(option);
            return {
                name: $option.text(),
                yahooRegionId: $option.val(),
            };
        });
        //remove first option "選擇地區"
        regionList.shift();
        return regionList;
    });
}
exports.getRegionList = getRegionList;
function get$(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(request);
        const html = yield response.text();
        return cheerio.load(html);
    });
}
//# sourceMappingURL=theaterCrawler.js.map