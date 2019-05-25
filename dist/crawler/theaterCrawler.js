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
const util_1 = require("../helper/util");
const theaterListUrl = 'http://www.atmovies.com.tw/showtime/';
function getTheaterList() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time('getTheaterList');
        const regionList = yield getRegionList();
        const promises = regionList.map(getTheaterListByRegion);
        const theaterList = [].concat(...(yield Promise.all(promises)));
        console.timeEnd('getTheaterList');
        return theaterList;
    });
}
exports.getTheaterList = getTheaterList;
function getRegionList() {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = yield util_1.getCheerio$(theaterListUrl);
        const regionList = Array.from($('map > [shape=rect]')).map((area) => {
            const $area = $(area);
            return {
                name: $area.attr('alt'),
                regionId: $area.attr('href').substr(theaterListUrl.length, 3),
            };
        });
        return regionList;
    });
}
exports.getRegionList = getRegionList;
function getTheaterListByRegion({ name: regionName, regionId }, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = yield util_1.getCheerio$(`${theaterListUrl}${regionId}/`);
        let theaterList = [];
        let subRegion = regionName;
        Array.from($('#theaterList>li')).forEach(li => {
            const $li = $(li);
            if ($li.hasClass('type0')) {
                subRegion = $li.text().trim().slice(0, -1);
            }
            else {
                const theaterInfo = $li.text().trim().replace(/\s+/g, ',').split(',');
                theaterList.push({
                    name: theaterInfo[0],
                    url: $li.find('a[target]').attr('href').split('weblink=')[1],
                    scheduleUrl: $li.find('a').attr('href'),
                    address: theaterInfo.slice(-2, -1)[0],
                    phone: theaterInfo[1],
                    region: regionName,
                    regionIndex: index,
                    subRegion
                });
            }
        });
        return theaterList;
    });
}
exports.getTheaterListByRegion = getTheaterListByRegion;
//# sourceMappingURL=theaterCrawler.js.map