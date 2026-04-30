module.exports = [
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/src/configs/systemSetting.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "googleApiSetting",
    ()=>googleApiSetting,
    "schedulerSetting",
    ()=>schedulerSetting,
    "systemSetting",
    ()=>systemSetting
]);
const systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27018/movierater',
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL === 'true',
    enableScheduler: process.env.ENABLE_SCHEDULER === 'true',
    isProduction: ("TURBOPACK compile-time value", "development") === 'production',
    redisUrlForApiCache: process.env.REDIS_URL || 'redis://localhost:6380/',
    redisUrlForScheduler: process.env.REDISCLOUD_URL || 'redis://localhost:6380/',
    taskTriggerKey: process.env.TASK_TRIGGER_KEY || 'taskTriggerKey'
};
const schedulerSetting = {
    pttPagePerTime: 50,
    yahooPagePerTime: 50
};
const googleApiSetting = {
    // It is a deleted API key, you could retrieve your own one to fetch the real data.
    geoApiKey: process.env.GOOGLEMAP_APIKEY || 'AIzaSyBcj5gbydKX6IdPnSxqDUwTTzlszB7oZVw'
};
console.log('systemSetting', JSON.stringify({
    ...systemSetting,
    dbUrl: ("TURBOPACK compile-time truthy", 1) ? '[redacted]' : "TURBOPACK unreachable",
    redisUrlForApiCache: ("TURBOPACK compile-time truthy", 1) ? '[redacted]' : "TURBOPACK unreachable",
    redisUrlForScheduler: ("TURBOPACK compile-time truthy", 1) ? '[redacted]' : "TURBOPACK unreachable",
    taskTriggerKey: ("TURBOPACK compile-time truthy", 1) ? '[redacted]' : "TURBOPACK unreachable"
}));
}),
"[project]/src/helper/log.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const debugEnabled = process.env.LOG_LEVEL === 'debug';
const log = {
    debug: function(functionName, args) {
        if (!debugEnabled) return;
        let logArgs = Array.from(args).map((arg)=>JSON.stringify(arg).substr(0, 100)).join(', ');
        console.log(`${functionName}(${logArgs})`);
    }
};
const __TURBOPACK__default__export__ = log;
}),
"[project]/src/data/db.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mongo",
    ()=>Mongo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/configs/systemSetting.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/log.ts [instrumentation] (ecmascript)");
;
;
;
class Mongo {
    static dbConnection = null;
    static db = null;
    static async openDbConnection() {
        try {
            if (!this.dbConnection) {
                this.dbConnection = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["systemSetting"].dbUrl);
                await this.dbConnection.connect();
                this.db = this.dbConnection.db();
                console.log('connect to mongodb correctly');
            }
        } catch (error) {
            console.error(error);
        }
        return this.dbConnection;
    }
    static closeDbConnection() {
        if (this.dbConnection) {
            this.dbConnection.close();
            this.dbConnection = null;
        }
    }
    static async updateDocument(filter, value, collectionName, options = {
        upsert: true
    }) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].debug('updateDocument', arguments);
            return await this.db.collection(collectionName).updateOne(filter, {
                $set: value
            }, options);
        } catch (error) {
            console.error(error);
        }
    }
    static async insertDocument(document, collectionName) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].debug('insertDocument', arguments);
            return await this.db.collection(collectionName).insertOne(document);
        } catch (error) {
            console.error(error);
        }
    }
    static async getCollection({ name, sort = {}, options = {} }) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].debug('getCollection', arguments);
            return await this.db.collection(name).find({}, options).sort(sort).toArray();
        } catch (error) {
            console.error(error);
        }
    }
    static async getDocument(query, collectionName) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].debug('getDocumnet', arguments);
            return await this.db.collection(collectionName).findOne(query);
        } catch (error) {
            console.error(error);
        }
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6f8b2e1a._.js.map