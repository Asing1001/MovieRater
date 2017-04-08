"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let log = {
    debug: function (args) {
        let functionName = new Error().stack.split(' ')[11].substr(9);
        let logArgs = Array.from(args).map(arg => JSON.stringify(arg).substr(0, 100)).join(', ');
        console.log(`${functionName}(${logArgs})`);
    }
};
exports.default = log;
//# sourceMappingURL=log.js.map