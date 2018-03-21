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
const moment = require("moment");
const movieSchduleUrl = 'http://www.atmovies.com.tw';
function crawlMovieSchdule(scheduleUrl, date) {
    return __awaiter(this, void 0, void 0, function* () {
        let schedules = [];
        try {
            const isToday = moment().format('YYYYMMDD') === date;
            const $ = yield util_1.getCheerio$(`${movieSchduleUrl + scheduleUrl}${isToday ? '' : date + '/'}`);
            schedules = Array.from($('#theaterShowtimeTable')).map(showTime => {
                const $showTime = $(showTime);
                const roomTypesString = $showTime.find('.filmVersion').text();
                const schedule = {
                    date,
                    scheduleUrl,
                    movieName: $showTime.find('.filmTitle>a').text(),
                    roomTypes: roomTypesString !== "" ? roomTypesString.split(',') : [],
                    level: $showTime.find('img[hspace]').attr('src'),
                    timesStrings: Array.from($showTime.find('li>ul:nth-child(2)').children(':not([class])')).map((e) => $(e).text().trim())
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
exports.default = crawlMovieSchdule;
//# sourceMappingURL=movieSchduleCrawler.js.map