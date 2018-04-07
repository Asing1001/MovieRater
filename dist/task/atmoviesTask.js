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
const redis = require("redis");
const systemSetting_1 = require("../configs/systemSetting");
const redisClient = redis.createClient(systemSetting_1.systemSetting.redisUrlForApiCache).on("error", err => console.log("Error " + err));
function updateMoviesSchedules() {
    return __awaiter(this, void 0, void 0, function* () {
        const scheduleUrls = yield db_1.db.getCollection({ name: "theaters", fields: { scheduleUrl: 1, _id: 0 } });
        const scheduleCrawlDate = yield getScheduleCrawlDate();
        let schedulesPromise = scheduleUrls.map(({ scheduleUrl }) => movieSchduleCrawler_1.crawlMovieSchdule(scheduleUrl, scheduleCrawlDate));
        const schedules = yield Promise.all(schedulesPromise);
        const allSchedules = [].concat(...schedules);
        redisClient.setex(scheduleCrawlDate, 86400 * 9, JSON.stringify(allSchedules));
        return allSchedules;
    });
}
exports.updateMoviesSchedules = updateMoviesSchedules;
function getMoviesSchedules() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const multi = redisClient.multi();
            for (let i = 0; i < 7; i++) {
                multi.get(moment().add(i, 'days').format('YYYYMMDD'));
            }
            multi.exec((err, replies) => {
                err && console.error(err);
                console.log("MULTI got " + replies.length + " replies");
                resolve([].concat(...replies.filter(reply => reply !== null).map(reply => JSON.parse(reply))));
            });
        });
    });
}
exports.getMoviesSchedules = getMoviesSchedules;
const crawlerStatusFilter = { name: "crawlerStatus" };
function getScheduleCrawlDate() {
    return __awaiter(this, void 0, void 0, function* () {
        let resultDay = 0;
        const { scheduleDay: currentScheduleDay } = yield db_1.db.getDocument(crawlerStatusFilter, "configs");
        if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
            resultDay = currentScheduleDay + 1;
        }
        UpdateScheduleCrawlDate(resultDay);
        return moment().add(resultDay, 'days').format('YYYYMMDD');
    });
}
function UpdateScheduleCrawlDate(day) {
    db_1.db.updateDocument(crawlerStatusFilter, { scheduleDay: day }, 'configs');
}
//# sourceMappingURL=atmoviesTask.js.map