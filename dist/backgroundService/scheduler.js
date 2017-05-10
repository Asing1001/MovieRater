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
const yahooTask_1 = require("../task/yahooTask");
const pttTask_1 = require("../task/pttTask");
const systemSetting_1 = require("../configs/systemSetting");
const fetch = require("isomorphic-fetch");
const cacheManager_1 = require("../data/cacheManager");
const imdbTask_1 = require("../task/imdbTask");
function initScheduler() {
    console.log("[initScheduler]");
    setInterval(function () {
        fetch(systemSetting_1.systemSetting.websiteUrl).then(res => console.log(`[Scheduler] Access to website:${systemSetting_1.systemSetting.websiteUrl}, status:${res.status}`));
    }, 600000, null);
    setInterval(function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] crawlYahoo');
            yield yahooTask_1.updateYahooMovies(systemSetting_1.schedulerSetting.yahooPagePerTime);
            console.timeEnd('[Scheduler] crawlYahoo');
            console.time('[Scheduler] updateImdbInfo');
            yield imdbTask_1.updateImdbInfo();
            console.timeEnd('[Scheduler] updateImdbInfo');
        });
    }, 900000, null);
    setInterval(function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] crawlPtt');
            yield pttTask_1.updatePttArticles(systemSetting_1.schedulerSetting.pttPagePerTime);
            console.timeEnd('[Scheduler] crawlPtt');
        });
    }, 900000, null);
    setInterval(function () {
        cacheManager_1.default.init();
    }, 86400000, null);
    setInterval(function () {
        cacheManager_1.default.setInTheaterMoviesCache();
    }, 3600000, null);
    setInterval(function () {
        yahooTask_1.updateTheaterWithLocationList();
    }, 86400000, null);
}
exports.initScheduler = initScheduler;
//# sourceMappingURL=scheduler.js.map