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
const yahooMovieSchduleUrl = 'https://movies.yahoo.com.tw/movietime_result.html?id=';
function crawlyahooMovieSchdule(yahooId) {
    return __awaiter(this, void 0, void 0, function* () {
        let schedules = [];
        try {
            const $ = yield util_1.getCheerio$(`${yahooMovieSchduleUrl + yahooId}`);
            const $items = $('.row-container .item');
            schedules = Array.from($items).map(element => {
                let $ele = $(element);
                let schedule = {
                    yahooId,
                    theaterName: $ele.find('a').text(),
                    timesValues: Array.from($ele.find('.tmt')).map((time) => $(time).attr('title')),
                    timesStrings: Array.from($ele.find('.tmt')).map((time) => $(time).text()),
                    roomTypes: Array.from($ele.find('.mvtype>img')).map((img) => {
                        const imgSrc = $(img).attr('src');
                        const match = /icon_([\w]*).gif/.exec(imgSrc);
                        return match ? match[1] : '';
                    }),
                };
                return schedule;
            });
        }
        catch (error) {
            console.error(error);
        }
        return schedules;
    });
}
exports.default = crawlyahooMovieSchdule;
//# sourceMappingURL=yahooMovieSchduleCrawler.js.map