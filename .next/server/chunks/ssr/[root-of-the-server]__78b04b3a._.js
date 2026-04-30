module.exports = [
"[project]/.next-internal/server/app/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/src/configs/systemSetting.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/helper/log.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/data/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mongo",
    ()=>Mongo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/configs/systemSetting.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/log.ts [app-rsc] (ecmascript)");
;
;
;
class Mongo {
    static dbConnection = null;
    static db = null;
    static async openDbConnection() {
        try {
            if (!this.dbConnection) {
                this.dbConnection = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["systemSetting"].dbUrl);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].debug('updateDocument', arguments);
            return await this.db.collection(collectionName).updateOne(filter, {
                $set: value
            }, options);
        } catch (error) {
            console.error(error);
        }
    }
    static async insertDocument(document, collectionName) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].debug('insertDocument', arguments);
            return await this.db.collection(collectionName).insertOne(document);
        } catch (error) {
            console.error(error);
        }
    }
    static async getCollection({ name, sort = {}, options = {} }) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].debug('getCollection', arguments);
            return await this.db.collection(name).find({}, options).sort(sort).toArray();
        } catch (error) {
            console.error(error);
        }
    }
    static async getDocument(query, collectionName) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$log$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].debug('getDocumnet', arguments);
            return await this.db.collection(collectionName).findOne(query);
        } catch (error) {
            console.error(error);
        }
    }
}
}),
"[project]/src/crawler/lineCrawler.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLINEArticle",
    ()=>getLINEArticle,
    "getPlayingMovies",
    ()=>getPlayingMovies
]);
async function getPlayingMovies() {
    try {
        const res = await fetch('https://today.line.me/webapi/movie/incinemas/listings/inCinemas?offset=0&length=200&country=tw');
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const response = await res.json();
        return response;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}
async function getLINEArticle(hash) {
    // https://today.line.me/webapi/portal/page/setting/article?country=tw&hash=1DODQOz&group=NA
    try {
        const res = await fetch(`https://today.line.me/webapi/portal/page/setting/article?country=tw&hash=${hash}&group=NA`);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const response = await res.json();
        return response;
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/node:assert [external] (node:assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:assert", () => require("node:assert"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/node:querystring [external] (node:querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:querystring", () => require("node:querystring"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:diagnostics_channel", () => require("node:diagnostics_channel"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:tls [external] (node:tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:tls", () => require("node:tls"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/node:perf_hooks [external] (node:perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:perf_hooks", () => require("node:perf_hooks"));

module.exports = mod;
}),
"[externals]/node:util/types [external] (node:util/types, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util/types", () => require("node:util/types"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:worker_threads [external] (node:worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:worker_threads", () => require("node:worker_threads"));

module.exports = mod;
}),
"[externals]/node:http2 [external] (node:http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http2", () => require("node:http2"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:console [external] (node:console, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:console", () => require("node:console"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:timers [external] (node:timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:timers", () => require("node:timers"));

module.exports = mod;
}),
"[externals]/node:dns [external] (node:dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:dns", () => require("node:dns"));

module.exports = mod;
}),
"[project]/src/helper/util.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCheerio$",
    ()=>getCheerio$
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/load-parse.js [app-rsc] (ecmascript)");
;
async function getCheerio$(url) {
    const response = await fetch(url);
    const html = await response.text();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["load"](html, {
        decodeEntities: false
    });
}
}),
"[project]/src/crawler/movieSchduleCrawler.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "crawlMovieSchdule",
    ()=>crawlMovieSchdule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/util.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [app-rsc] (ecmascript)");
;
;
const movieSchduleUrl = 'http://www.atmovies.com.tw';
async function crawlMovieSchdule(scheduleUrl, date) {
    let schedules = [];
    const isToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])().format('YYYYMMDD') === date;
    const atmovieScheduleUrl = `${movieSchduleUrl + scheduleUrl}${isToday ? '' : date + '/'}`;
    try {
        const $ = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCheerio$"])(atmovieScheduleUrl);
        schedules = Array.from($('#theaterShowtimeTable')).map((showTime)=>{
            const $showTime = $(showTime);
            const roomTypesString = $showTime.find('.filmVersion').text();
            const schedule = {
                date,
                scheduleUrl,
                movieName: $showTime.find('.filmTitle>a').text(),
                roomTypes: roomTypesString !== "" ? roomTypesString.split(',') : [],
                level: $showTime.find('img[hspace]').attr('src'),
                timesStrings: Array.from($showTime.find('li>ul:nth-child(2)').children(':not([class])')).map((e)=>$(e).text().substr(0, 5))
            };
            return schedule;
        });
    } catch (error) {
        console.error('crawlMovieSchdule fail!');
        console.error(error);
    }
    console.log(`crawlMovieSchdule(${atmovieScheduleUrl}, ${date}), schedules.length: ${schedules.length}`);
    return schedules;
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/src/helper/chunk.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chunk",
    ()=>chunk
]);
function chunk(items, size) {
    const chunks = [];
    for(let i = 0; i < items.length; i += size){
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}
}),
"[project]/src/helper/promiseMap.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "promiseMap",
    ()=>promiseMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$chunk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/chunk.ts [app-rsc] (ecmascript)");
;
async function promiseMap(items, callback, options) {
    const { concurrency, delay } = options;
    const itemChunks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$chunk$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["chunk"])(items, concurrency);
    const result = [];
    for (const chunk of itemChunks){
        const chunkResults = await Promise.all(chunk.map(callback));
        result.push(...chunkResults);
        if (delay) {
            await new Promise((resolve)=>setTimeout(resolve, delay));
        }
    }
    return result;
}
}),
"[project]/src/task/atmoviesTask.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMoviesSchedules",
    ()=>getMoviesSchedules,
    "updateMoviesSchedules",
    ()=>updateMoviesSchedules
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$movieSchduleCrawler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/movieSchduleCrawler.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ioredis$2f$built$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ioredis/built/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/configs/systemSetting.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/promiseMap.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
const redisClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ioredis$2f$built$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["systemSetting"].redisUrlForScheduler);
redisClient.on('error', (err)=>console.log('Redis error: ' + err));
async function updateMoviesSchedules() {
    const scheduleUrls = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Mongo"].db.collection('theaters').find({}, {
        projection: {
            scheduleUrl: 1,
            _id: 0
        }
    }).toArray();
    const scheduleCrawlDate = await getScheduleCrawlDate();
    console.log('scheduleCrawlDate', scheduleCrawlDate);
    const schedules = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["promiseMap"])(scheduleUrls, ({ scheduleUrl })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$movieSchduleCrawler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["crawlMovieSchdule"])(scheduleUrl, scheduleCrawlDate), {
        concurrency: 15,
        delay: 100
    });
    const allSchedules = [].concat(...schedules);
    console.log('allSchedules.length', allSchedules.length);
    redisClient.setex(scheduleCrawlDate, 86400 * 2, JSON.stringify(allSchedules));
    return allSchedules;
}
async function getMoviesSchedules() {
    const multi = redisClient.multi();
    for(let i = 0; i < 7; i++){
        multi.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])().add(i, 'days').format('YYYYMMDD'));
    }
    const replies = await multi.exec();
    console.log('getMoviesSchedules got ' + replies.length + ' replies');
    const schedules = [].concat(...replies.filter(([err, reply])=>!err && reply !== null).map(([, reply])=>JSON.parse(reply)));
    return schedules;
}
const crawlerStatusFilter = {
    name: 'crawlerStatus'
};
async function getScheduleCrawlDate() {
    let resultDay = 0;
    const { scheduleDay: currentScheduleDay } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Mongo"].getDocument(crawlerStatusFilter, 'configs');
    if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
        resultDay = currentScheduleDay + 1;
    }
    UpdateScheduleCrawlDate(resultDay);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])().add(resultDay, 'days').format('YYYYMMDD');
}
function UpdateScheduleCrawlDate(day) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Mongo"].updateDocument(crawlerStatusFilter, {
        scheduleDay: day
    }, 'configs');
}
}),
"[project]/src/helper/isValideDate.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const validDateReg = /^\d{4}-\d{1,2}-\d{1,2}$/;
function __TURBOPACK__default__export__(dateString) {
    return validDateReg.test(dateString);
}
}),
"[project]/src/data/cacheManager.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>cacheManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/lineCrawler.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/atmoviesTask.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$isValideDate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/isValideDate.ts [app-rsc] (ecmascript)");
;
;
;
;
;
if (!globalThis.__cacheStore) globalThis.__cacheStore = new Map();
class cacheManager {
    static get _store() {
        return globalThis.__cacheStore;
    }
    static All_MOVIES = 'allMovies';
    static All_MOVIES_NAMES = 'allMoviesNames';
    static MOVIES_BY_CHINESE_TITLE = 'moviesByChineseTitle';
    static RECENT_MOVIES = 'recentMovies';
    static MOVIES_SCHEDULES = 'MoviesSchedules';
    static MOVIES_SCHEDULES_BY_MOVIE_NAME = 'MoviesSchedulesByMovieName';
    static MOVIES_SCHEDULES_BY_THEATER_URL = 'MoviesSchedulesByTheaterUrl';
    static THEATERS = 'theaters';
    static THEATERS_BY_SCHEDULE_URL = 'theatersByScheduleUrl';
    static async init() {
        const mergedDatas = await cacheManager.getMergedDatas();
        cacheManager.set(cacheManager.All_MOVIES, mergedDatas);
        cacheManager.setMovieLookupCache(mergedDatas);
        cacheManager.setAllMoviesNamesCache(mergedDatas);
        await cacheManager.setTheatersCache();
        await cacheManager.setRecentMoviesCache();
        // To let the api return data ASAP, we serve the schedules from Redis first
        await cacheManager.setMoviesSchedulesCache();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMoviesSchedules"])();
        await cacheManager.setMoviesSchedulesCache();
    }
    static async getMergedDatas() {
        console.time('Get mergedDatas');
        const mergedDatas = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Mongo"].getCollection({
            name: 'mergedDatas'
        });
        console.timeEnd('Get mergedDatas');
        return mergedDatas;
    }
    static setMovieLookupCache(movies) {
        const moviesByChineseTitle = {};
        movies.forEach((movie)=>{
            if (movie.chineseTitle && !moviesByChineseTitle[movie.chineseTitle]) {
                moviesByChineseTitle[movie.chineseTitle] = movie;
            }
        });
        cacheManager.set(cacheManager.MOVIES_BY_CHINESE_TITLE, moviesByChineseTitle);
    }
    static setAllMoviesNamesCache(movies) {
        let allMoviesName = [];
        console.time('setAllMoviesNamesCache');
        movies.forEach(({ chineseTitle, englishTitle, movieBaseId })=>{
            if (chineseTitle) {
                allMoviesName.push({
                    value: movieBaseId,
                    text: chineseTitle
                });
            }
            if (englishTitle && englishTitle !== chineseTitle) {
                allMoviesName.push({
                    value: movieBaseId,
                    text: englishTitle
                });
            }
        });
        cacheManager.set(cacheManager.All_MOVIES_NAMES, allMoviesName);
        console.timeEnd('setAllMoviesNamesCache');
    }
    static async setTheatersCache() {
        console.time('setTheatersCache');
        const theaterListWithLocation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Mongo"].getCollection({
            name: 'theaters',
            sort: {
                regionIndex: 1
            }
        });
        console.timeEnd('setTheatersCache');
        cacheManager.set(cacheManager.THEATERS, theaterListWithLocation);
        cacheManager.set(cacheManager.THEATERS_BY_SCHEDULE_URL, cacheManager.groupOneBy(theaterListWithLocation, 'scheduleUrl'));
    }
    // This is the list of movies in home page
    static async setRecentMoviesCache() {
        console.time('setRecentMoviesCache');
        const inTheaterResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlayingMovies"])();
        const inTheaterLineIds = inTheaterResponse.items.map((item)=>item.id);
        const hasInTheaterData = inTheaterLineIds && inTheaterLineIds.length;
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])();
        const recentMovies = cacheManager.get(cacheManager.All_MOVIES).filter(({ releaseDate, lineMovieId })=>{
            const hasLINEMovieId = Boolean(lineMovieId);
            const releaseMoment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$isValideDate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(releaseDate) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(releaseDate) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])();
            return hasLINEMovieId && (!hasInTheaterData || inTheaterLineIds.indexOf(lineMovieId) !== -1) && today.diff(releaseMoment, 'days') <= 60;
        });
        cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
        console.timeEnd('setRecentMoviesCache');
    }
    static async setMoviesSchedulesCache() {
        console.time('setMoviesSchedulesCache');
        try {
            const allSchedules = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMoviesSchedules"])();
            // currently the schedules here has some data that could not mapped to LINE's movie title
            // TODO: get the schedule directly from LINE so we don't need this filter, and the display will be more accurate
            const recentMovieChineseTitles = cacheManager.get(cacheManager.RECENT_MOVIES).map((movie)=>movie.chineseTitle);
            const filterdSchedules = allSchedules.filter((schedule)=>recentMovieChineseTitles.indexOf(schedule.movieName) !== -1);
            cacheManager.set(cacheManager.MOVIES_SCHEDULES, filterdSchedules);
            cacheManager.set(cacheManager.MOVIES_SCHEDULES_BY_MOVIE_NAME, cacheManager.groupBy(filterdSchedules, 'movieName'));
            cacheManager.set(cacheManager.MOVIES_SCHEDULES_BY_THEATER_URL, cacheManager.groupBy(filterdSchedules, 'scheduleUrl'));
        } catch (ex) {
            console.error(ex);
        }
        console.timeEnd('setMoviesSchedulesCache');
    }
    static groupBy(items, key) {
        return items.reduce((groups, item)=>{
            const value = item[key];
            if (!value) {
                return groups;
            }
            groups[value] = groups[value] || [];
            groups[value].push(item);
            return groups;
        }, {});
    }
    static groupOneBy(items, key) {
        return items.reduce((groups, item)=>{
            const value = item[key];
            if (value && !groups[value]) {
                groups[value] = item;
            }
            return groups;
        }, {});
    }
    static getMovieByChineseTitle(chineseTitle) {
        const moviesByChineseTitle = cacheManager.get(cacheManager.MOVIES_BY_CHINESE_TITLE) || {};
        return moviesByChineseTitle[chineseTitle];
    }
    static getSchedulesByMovieName(movieName) {
        const schedulesByMovieName = cacheManager.get(cacheManager.MOVIES_SCHEDULES_BY_MOVIE_NAME) || {};
        return schedulesByMovieName[movieName] || [];
    }
    static getSchedulesByTheaterUrl(scheduleUrl) {
        const schedulesByTheaterUrl = cacheManager.get(cacheManager.MOVIES_SCHEDULES_BY_THEATER_URL) || {};
        return schedulesByTheaterUrl[scheduleUrl] || [];
    }
    static getTheaterByScheduleUrl(scheduleUrl) {
        const theatersByScheduleUrl = cacheManager.get(cacheManager.THEATERS_BY_SCHEDULE_URL) || {};
        return theatersByScheduleUrl[scheduleUrl];
    }
    static get(key) {
        return cacheManager._store.get(key);
    }
    static set(key, value) {
        cacheManager._store.set(key, value);
    }
}
}),
"[project]/src/lib/movies.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "briefSummary",
    ()=>briefSummary,
    "getAllMovieNames",
    ()=>getAllMovieNames,
    "getMovieById",
    ()=>getMovieById,
    "getRecentMovies",
    ()=>getRecentMovies,
    "getUpcomingMovies",
    ()=>getUpcomingMovies,
    "searchMovies",
    ()=>searchMovies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/cacheManager.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
;
function getRecentMovies() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].RECENT_MOVIES) ?? [];
}
function getUpcomingMovies() {
    const all = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].All_MOVIES) ?? [];
    const today = Date.now();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    return all.filter(({ releaseDate })=>{
        const d = new Date(releaseDate).getTime();
        return d > today && d < today + ninetyDaysMs;
    });
}
function getMovieById(id) {
    const all = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].All_MOVIES) ?? [];
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"].isValid(id)) {
        return all.find((m)=>m.movieBaseId?.toString() === id);
    }
    return all.find((m)=>m.yahooId?.toString() === id);
}
function briefSummary(summary) {
    if (!summary) return '';
    return summary.length > 70 ? summary.slice(0, 70) + '...' : summary;
}
function getAllMovieNames() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].All_MOVIES_NAMES) ?? [];
}
function searchMovies(query) {
    const all = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].All_MOVIES) ?? [];
    const q = query.toLowerCase();
    return all.filter(({ chineseTitle, englishTitle })=>chineseTitle?.toLowerCase().includes(q) || englishTitle?.toLowerCase().includes(q)).slice(0, 10);
}
}),
"[project]/src/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyArticle",
    ()=>classifyArticle,
    "getDistanceInKM",
    ()=>getDistanceInKM,
    "getMovieSchema",
    ()=>getMovieSchema,
    "sortMovies",
    ()=>sortMovies
]);
function classifyArticle(movie) {
    if (!movie?.relatedArticles) return movie;
    const m = {
        ...movie,
        goodRateArticles: [],
        normalRateArticles: [],
        badRateArticles: [],
        otherArticles: []
    };
    for (const article of movie.relatedArticles){
        const t = article.title ?? '';
        if (t.includes('好雷') || t.includes('好無雷')) m.goodRateArticles.push(article);
        else if (t.includes('普雷')) m.normalRateArticles.push(article);
        else if (t.includes('負雷')) m.badRateArticles.push(article);
        else m.otherArticles.push(article);
    }
    return m;
}
function sortMovies(movies, sortKey = 'releaseDate') {
    return [
        ...movies
    ].sort((a, b)=>{
        switch(sortKey){
            case 'imdb':
                return (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0);
            case 'line':
                return (parseFloat(b.lineRating) || 0) - (parseFloat(a.lineRating) || 0);
            case 'ptt':
                {
                    const score = (m)=>(m.goodRateArticles?.length ?? 0) - (m.badRateArticles?.length ?? 0);
                    return score(b) - score(a);
                }
            case 'releaseDate':
            default:
                return new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime();
        }
    });
}
function getDistanceInKM(lon1, lat1, lon2, lat2) {
    const R = 6371;
    const toRad = (n)=>n * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
function getMovieSchema(movie) {
    const good = movie.goodRateArticles?.length ?? 0;
    const bad = movie.badRateArticles?.length ?? 0;
    const normal = movie.normalRateArticles?.length ?? 0;
    const total = good + bad + normal || 1;
    const clamp = (v)=>Math.min(5, Math.max(0, v));
    const pttRating = clamp((good * 10 + normal * 7 - bad * 2) / total / 2 || 3.5);
    const imdbRating = clamp(parseFloat(movie.imdbRating) / 2 || 3.5);
    const lineRating = clamp(parseFloat(movie.lineRating) / 2 || 3.5);
    return {
        '@context': 'http://schema.org',
        '@type': 'Movie',
        name: `${movie.chineseTitle} ${movie.englishTitle}`,
        image: movie.posterUrl,
        url: `https://www.mvrater.com/movie/${movie.movieBaseId}`,
        datePublished: movie.releaseDate,
        actor: {
            '@type': 'Person',
            name: movie.actors?.join(',')
        },
        director: {
            '@type': 'Person',
            name: movie.directors?.join(',')
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ((imdbRating + lineRating + pttRating) / 3).toFixed(1),
            ratingCount: total + 2
        }
    };
}
}),
"[project]/src/components/Ratings.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Ratings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function Ratings({ movie, className }) {
    const g = movie.goodRateArticles?.length ?? 0;
    const n = movie.normalRateArticles?.length ?? 0;
    const b = movie.badRateArticles?.length ?? 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            paddingTop: '1em',
            paddingBottom: '1em',
            paddingLeft: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ratingWrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "logo imdb",
                        children: "IMDb"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this),
                    movie.imdbID ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `https://www.imdb.com/title/${movie.imdbID}`,
                        children: movie.imdbRating || 'N/A'
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 13,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: movie.imdbRating || 'N/A'
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 15,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Ratings.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            movie.lineRating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ratingWrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "logo line",
                        children: "LINE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `https://today.line.me/tw/v2/movie/${movie.lineUrlHash}/2`,
                        children: movie.lineRating || 'N/A'
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Ratings.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ratingWrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "logo yahoo",
                        children: "Y!"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `https://movies.yahoo.com.tw/movieinfo_main.html/id=${movie.yahooId}`,
                        children: movie.yahooRating || 'N/A'
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Ratings.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ratingWrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "logo ptt",
                        children: "PTT"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        title: "好雷/普雷/負雷",
                        children: [
                            g,
                            "/",
                            n,
                            "/",
                            b
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Ratings.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Ratings.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Ratings.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/MovieCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MovieCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/Paper/Paper.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/Box/Box.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/Typography/Typography.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Ratings$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Ratings.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
function MovieCard({ movie, children }) {
    const href = `/movie/${movie.movieBaseId}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Paper$2f$Paper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        elevation: 2,
        sx: {
            mb: 1,
            display: 'flex',
            flexDirection: 'row'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                style: {
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    className: "poster",
                    src: movie.posterUrl,
                    alt: movie.chineseTitle,
                    loading: "lazy",
                    style: {
                        display: 'block'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/MovieCard.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/MovieCard.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                sx: {
                    flex: 1,
                    p: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: href,
                        style: {
                            color: 'inherit',
                            textDecoration: 'none'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                variant: "subtitle1",
                                fontWeight: 700,
                                className: "card-title",
                                children: movie.chineseTitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/MovieCard.tsx",
                                lineNumber: 23,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                variant: "caption",
                                color: "text.secondary",
                                children: movie.englishTitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/MovieCard.tsx",
                                lineNumber: 26,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/MovieCard.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Box$2f$Box$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        sx: {
                            mt: 0.5,
                            fontSize: '0.85rem'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            style: {
                                color: 'inherit',
                                textDecoration: 'none'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "上映日期：",
                                        movie.releaseDate || '未提供'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MovieCard.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "類型：",
                                        movie.types?.join('、') || '未提供'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MovieCard.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        "片長：",
                                        movie.runTime ? `${movie.runTime}分鐘` : '未提供'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/MovieCard.tsx",
                                    lineNumber: 35,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/MovieCard.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/MovieCard.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Ratings$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        movie: movie
                    }, void 0, false, {
                        fileName: "[project]/src/components/MovieCard.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MovieCard.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MovieCard.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$movies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/movies.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MovieCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MovieCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/Typography/Typography.js [app-rsc] (ecmascript)");
;
;
;
;
;
const metadata = {
    title: '現正上映 - Movie Rater'
};
async function HomePage({ searchParams }) {
    const { sort } = await searchParams;
    const movies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$movies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRecentMovies"])().map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["classifyArticle"]);
    const sorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sortMovies"])(movies, sort || 'releaseDate');
    if (!sorted.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$Typography$2f$Typography$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            sx: {
                mt: 4,
                textAlign: 'center'
            },
            children: "載入中，請稍後..."
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 15,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: sorted.map((movie)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MovieCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                movie: movie,
                children: movie.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "resultSummary",
                    style: {
                        fontSize: '0.85rem',
                        marginTop: 4
                    },
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$movies$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["briefSummary"])(movie.summary)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 23,
                    columnNumber: 13
                }, this)
            }, movie.movieBaseId?.toString(), false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this))
    }, void 0, false);
}
}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__78b04b3a._.js.map