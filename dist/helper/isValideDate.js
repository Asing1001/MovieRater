"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validDateReg = /^\d{4}-\d{1,2}-\d{1,2}$/;
function default_1(dateString) {
    return validDateReg.test(dateString);
}
exports.default = default_1;
//# sourceMappingURL=isValideDate.js.map