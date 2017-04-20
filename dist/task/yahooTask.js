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
const yahooCrawler_1 = require("../crawler/yahooCrawler");
const db_1 = require("../data/db");
const Q = require("q");
function updateTheaterList() {
    return __awaiter(this, void 0, void 0, function* () {
        const theaterList = yield theaterCrawler_1.getTheaterList();
        return Promise.all(theaterList.map(theater => db_1.db.updateDocument({ name: theater.name }, theater, 'theaters')));
    });
}
exports.updateTheaterList = updateTheaterList;
function updateYahooMovies(howManyPagePerTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const range = yield getCurrentCrawlRange(howManyPagePerTime);
        const yahooMovies = yield getRangeYahooMovies(range);
        updateMaxYahooId(yahooMovies, range.startYahooId);
        yield Promise.all(yahooMovies.map(yahooMovie => db_1.db.updateDocument({ yahooId: yahooMovie.yahooId }, yahooMovie, "yahooMovies")));
    });
}
exports.updateYahooMovies = updateYahooMovies;
const crawlerStatusFilter = { name: "crawlerStatus" };
function getCurrentCrawlRange(howManyPagePerTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const crawlerStatus = yield db_1.db.getDocument(crawlerStatusFilter, "configs");
        const startYahooId = crawlerStatus.maxYahooId + 1;
        return { startYahooId, endYahooId: startYahooId + howManyPagePerTime - 1 };
    });
}
function getRangeYahooMovies({ startYahooId, endYahooId }) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = [];
        for (let i = startYahooId; i <= endYahooId; i++) {
            const promise = yahooCrawler_1.getYahooMovieInfo(i);
            promises.push(promise);
        }
        const results = yield Q.allSettled(promises);
        let yahooMovies = [];
        results.forEach((result) => {
            if (result.state === "fulfilled") {
                var value = result.value;
                yahooMovies.push(value);
            }
            else {
                var reason = result.reason;
                console.error(reason);
            }
        });
        return yahooMovies;
    });
}
function updateMaxYahooId(yahooMovies, startYahooId) {
    const movieIds = yahooMovies.map(({ yahooId }) => yahooId);
    let newMaxYahooId = Math.max(...movieIds, startYahooId);
    const alreadyCrawlTheNewest = newMaxYahooId === startYahooId;
    if (alreadyCrawlTheNewest) {
        newMaxYahooId = 1;
    }
    db_1.db.updateDocument(crawlerStatusFilter, { maxYahooId: newMaxYahooId }, 'configs');
    console.log(`new movieInfo count:${yahooMovies.length}, newMaxYahooId:${newMaxYahooId}`);
}
//# sourceMappingURL=yahooTask.js.map