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
const node_schedule_1 = require("node-schedule");
const systemSetting_1 = require("../configs/systemSetting");
const yahooTask_1 = require("../task/yahooTask");
const pttTask_1 = require("../task/pttTask");
const imdbTask_1 = require("../task/imdbTask");
const cacheManager_1 = require("../data/cacheManager");
function initScheduler() {
    if (!systemSetting_1.systemSetting.enableScheduler) {
        return;
    }
    console.log("[Scheduler] init");
    if (systemSetting_1.systemSetting.keepAlive) {
        setInterval(function () {
            fetch(systemSetting_1.systemSetting.websiteUrl).then(res => console.log(`[Scheduler] Access to website:${systemSetting_1.systemSetting.websiteUrl}, status:${res.status}`));
        }, 600000);
    }
    node_schedule_1.scheduleJob('10 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] updateYahooMovies');
            yield yahooTask_1.updateYahooMovies(systemSetting_1.schedulerSetting.yahooPagePerTime);
            console.timeEnd('[Scheduler] updateYahooMovies');
        });
    });
    node_schedule_1.scheduleJob('15 * * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] updatePttArticles');
            yield pttTask_1.updatePttArticles(systemSetting_1.schedulerSetting.pttPagePerTime);
            console.timeEnd('[Scheduler] updatePttArticles');
        });
    });
    node_schedule_1.scheduleJob('20 * * * *', function () {
        cacheManager_1.default.setInTheaterMoviesCache();
    });
    node_schedule_1.scheduleJob('30 5 * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] updateTheaterWithLocationList');
            yield yahooTask_1.updateTheaterWithLocationList();
            console.timeEnd('[Scheduler] updateTheaterWithLocationList');
        });
    });
    node_schedule_1.scheduleJob('40 5 * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] cacheManager.init');
            yield cacheManager_1.default.init();
            console.timeEnd('[Scheduler] cacheManager.init');
        });
    });
    node_schedule_1.scheduleJob('30 6 * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.time('[Scheduler] updateImdbInfo');
            yield imdbTask_1.updateImdbInfo();
            console.timeEnd('[Scheduler] updateImdbInfo');
        });
    });
}
exports.initScheduler = initScheduler;
//# sourceMappingURL=scheduler.js.map