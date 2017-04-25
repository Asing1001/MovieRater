"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theater_1 = require("../models/theater");
class Schedule {
    constructor(yahooId = 0, theaterName = "", timesValues = [], timesStrings = [], theaterExtension = new theater_1.default()) {
        this.yahooId = yahooId;
        this.theaterName = theaterName;
        this.timesValues = timesValues;
        this.timesStrings = timesStrings;
        this.theaterExtension = theaterExtension;
    }
}
exports.default = Schedule;
//# sourceMappingURL=schedule.js.map