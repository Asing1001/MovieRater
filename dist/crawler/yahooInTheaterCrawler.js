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
const util_1 = require("../helper/util");
const inTheaterUrl = 'https://movies.yahoo.com.tw/';
function getInTheaterYahooIds() {
    return __awaiter(this, void 0, void 0, function* () {
        let yahooIds = [];
        try {
            const $ = yield util_1.getCheerio$(inTheaterUrl);
            yahooIds = Array.from($('select.auto[name="id"]').find('option[value!=""]')).map((option) => parseInt($(option).val()));
        }
        catch (error) {
            console.error(error);
        }
        return yahooIds;
    });
}
exports.getInTheaterYahooIds = getInTheaterYahooIds;
//# sourceMappingURL=yahooInTheaterCrawler.js.map