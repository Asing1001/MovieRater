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
const mergeData_1 = require("../crawler/mergeData");
const db_1 = require("../data/db");
const main = () => __awaiter(this, void 0, void 0, function* () {
    yield db_1.db.openDbConnection();
    const yahooMoviesPromise = db_1.db.getCollection({ name: "yahooMovies", sort: { yahooId: -1 } });
    const pttArticlesPromise = db_1.db.getCollection({ name: "pttArticles" });
    console.time('get yahooMovies and pttArticles');
    const [yahooMovies, pttArticles] = yield Promise.all([yahooMoviesPromise, pttArticlesPromise]);
    console.timeEnd('get yahooMovies and pttArticles');
    console.time('mergeData');
    const mergedDatas = mergeData_1.mergeData(yahooMovies, pttArticles);
    console.timeEnd('mergeData');
    console.log('mergedDatas.length', mergedDatas.length);
    console.time('Insert mergedDatas');
    const batchSize = 100;
    for (let batchIndex = 0; batchIndex < mergedDatas.length / batchSize; batchIndex++) {
        console.time(`Insert mergedDatas batch ${batchIndex}`);
        const bulk = db_1.db.dbConnection.collection('mergedDatas').initializeUnorderedBulkOp();
        const start = batchIndex * batchSize;
        const end = start + batchSize;
        mergedDatas.slice(start, end).forEach(data => {
            bulk.find({ yahooId: data.yahooId }).upsert().updateOne(data);
        });
        yield bulk.execute();
        console.timeEnd(`Insert mergedDatas batch ${batchIndex}`);
    }
    console.timeEnd('Insert mergedDatas');
    process.exit();
});
main();
//# sourceMappingURL=mergeDataJob.js.map