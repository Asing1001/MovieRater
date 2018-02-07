"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theater_1 = require("../models/theater");
class Schedule {
    constructor(scheduleUrl = "", theaterName = "", timesStrings = [], theaterExtension = new theater_1.default()) {
        this.scheduleUrl = scheduleUrl;
        this.theaterName = theaterName;
        this.timesStrings = timesStrings;
        this.theaterExtension = theaterExtension;
    }
}
exports.default = Schedule;
//# sourceMappingURL=schedule.js.map