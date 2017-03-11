"use strict";
var moment = require('moment');
var log = {
    debug: function (args) {
        var functionName = new Error().stack.split(' ')[11].substr(9);
        var logArgs = Array.from(args).map(function (arg) { return JSON.stringify(arg).substr(0, 100); }).join(', ');
        console.log(moment().utcOffset(8).format() + ": " + functionName + "(" + logArgs + ")");
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = log;
//# sourceMappingURL=log.js.map