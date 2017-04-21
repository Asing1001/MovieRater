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
const mongodb_1 = require("mongodb");
const systemSetting_1 = require("../configs/systemSetting");
setup();
let db;
//It Will not override any exist collection, document and index, so don't be afraid if accidently excute it.
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        db = yield mongodb_1.MongoClient.connect(systemSetting_1.systemSetting.dbUrl);
        yield ensureCollectionAndIndex();
        yield ensureCrawlerStatus();
        console.log('db setup done');
    });
}
function ensureCollectionAndIndex() {
    return __awaiter(this, void 0, void 0, function* () {
        //It will 
        //1. create collection if collection not exist
        //2. create index if index not exist
        yield db.collection('yahooMovies').createIndex({ "yahooId": -1 });
        yield db.collection('pttArticles').createIndex({ "url": -1 });
    });
}
function ensureCrawlerStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultCrawlerStatus = {
            name: "crawlerStatus",
            maxYahooId: 1,
            maxPttIndex: 1
        };
        const isCrawlerStatusExist = yield db.collection("configs").count({ name: defaultCrawlerStatus.name });
        isCrawlerStatusExist || (yield db.collection("configs").insert(defaultCrawlerStatus));
    });
}
//# sourceMappingURL=firstTimeSetup.js.map