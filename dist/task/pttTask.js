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
const pttCrawler_1 = require("../crawler/pttCrawler");
const db_1 = require("../data/db");
const Q = require("q");
function updatePttArticles(howManyPagePerTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const range = yield getCurrentCrawlRange(howManyPagePerTime);
        const pttPages = yield getRangePttPages(range);
        updateMaxPttIndex(pttPages, range.startPttIndex);
        let pttArticles = [].concat(...pttPages.map(({ articles }) => articles));
        yield Promise.all(pttArticles.map(pttArticle => db_1.db.updateDocument({ url: pttArticle.url }, pttArticle, "pttArticles")));
    });
}
exports.updatePttArticles = updatePttArticles;
const crawlerStatusFilter = { name: "crawlerStatus" };
function getCurrentCrawlRange(howManyPagePerTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerStatus = yield db_1.db.getDocument(crawlerStatusFilter, "configs");
        const startPttIndex = crawlerStatus.maxPttIndex + 1;
        return { startPttIndex, endPttIndex: startPttIndex + howManyPagePerTime - 1 };
    });
}
function getRangePttPages({ startPttIndex, endPttIndex }) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (let i = startPttIndex; i <= endPttIndex; i++) {
            const promise = pttCrawler_1.getPttPage(i);
            promises.push(promise);
        }
        const results = yield Q.allSettled(promises);
        let pttPages = [];
        results.forEach((result) => {
            if (result.state === "fulfilled") {
                var value = result.value;
                pttPages.push(value);
            }
            else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        return pttPages;
    });
}
function updateMaxPttIndex(pttPages, startPttIndex) {
    const pttIndexs = pttPages.map(({ pageIndex }) => pageIndex);
    let newMaxPttIndex = Math.max(...pttIndexs, startPttIndex);
    const alreadyCrawlTheNewest = newMaxPttIndex === startPttIndex;
    if (alreadyCrawlTheNewest) {
        newMaxPttIndex = newMaxPttIndex - 100 > 0 ? newMaxPttIndex - 100 : 1;
    }
    db_1.db.updateDocument(crawlerStatusFilter, { maxPttIndex: newMaxPttIndex }, 'configs');
    console.log(`new pttPages count:${pttPages.length}, newMaxPttIndex:${newMaxPttIndex}`);
}
//# sourceMappingURL=pttTask.js.map