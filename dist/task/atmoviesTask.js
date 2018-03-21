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
const movieSchduleCrawler_1 = require("../crawler/movieSchduleCrawler");
const moment = require("moment");
const db_1 = require("../data/db");
function getMoviesSchedules(scheduleUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const scheduleCrawlDay = getScheduleCrawlDay();
        let schedulesPromise = scheduleUrls.map(scheduleUrl => movieSchduleCrawler_1.default(scheduleUrl, moment().add(scheduleCrawlDay, 'days').format('YYYYMMDD')));
        const schedules = yield Promise.all(schedulesPromise);
        const allSchedules = [].concat(...schedules);
        return allSchedules;
    });
}
exports.getMoviesSchedules = getMoviesSchedules;
const crawlerStatusFilter = { name: "crawlerStatus" };
function getScheduleCrawlDay() {
    return __awaiter(this, void 0, void 0, function* () {
        let resultDay = 0;
        const { scheduleDay: currentScheduleDay } = yield db_1.db.getDocument(crawlerStatusFilter, "configs");
        if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
            resultDay = currentScheduleDay + 1;
        }
        UpdateScheduleCrawlDay(resultDay);
        return resultDay;
    });
}
function UpdateScheduleCrawlDay(day) {
    db_1.db.updateDocument(crawlerStatusFilter, { scheduleDay: day }, 'configs');
}
//# sourceMappingURL=atmoviesTask.js.map