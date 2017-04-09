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
const theaterCrawler_1 = require("../crawler/theaterCrawler");
const db_1 = require("../data/db");
function updateTheaterList() {
    return __awaiter(this, void 0, void 0, function* () {
        const theaterList = yield theaterCrawler_1.getTheaterList();
        return Promise.all(theaterList.map(theater => db_1.db.updateDocument({ name: theater.name }, theater, 'theaters')));
    });
}
exports.updateTheaterList = updateTheaterList;
//# sourceMappingURL=task.js.map