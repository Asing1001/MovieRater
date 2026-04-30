module.exports = [
"[project]/.next-internal/server/app/theaters/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/theaters.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSchedulesByMovieName",
    ()=>getSchedulesByMovieName,
    "getSchedulesByTheaterUrl",
    ()=>getSchedulesByTheaterUrl,
    "getTheaterByName",
    ()=>getTheaterByName,
    "getTheaters",
    ()=>getTheaters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/cacheManager.ts [app-rsc] (ecmascript)");
;
function getTheaters() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].THEATERS) ?? [];
}
function getTheaterByName(name) {
    const theaters = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].THEATERS) ?? [];
    return theaters.find((t)=>t.name === name);
}
function getSchedulesByMovieName(movieName) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].getSchedulesByMovieName(movieName);
}
function getSchedulesByTheaterUrl(scheduleUrl) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].getSchedulesByTheaterUrl(scheduleUrl);
}
}),
"[project]/src/components/TheaterList.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/TheaterList.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/TheaterList.tsx <module evaluation>", "default");
}),
"[project]/src/components/TheaterList.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/TheaterList.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/TheaterList.tsx", "default");
}),
"[project]/src/components/TheaterList.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TheaterList$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/TheaterList.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TheaterList$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/TheaterList.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TheaterList$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/theaters/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TheatersPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$theaters$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/theaters.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TheaterList$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/TheaterList.tsx [app-rsc] (ecmascript)");
;
;
;
const metadata = {
    title: '電影院 - Movie Rater'
};
function TheatersPage() {
    const theaters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$theaters$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTheaters"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$TheaterList$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        theaters: theaters
    }, void 0, false, {
        fileName: "[project]/src/app/theaters/page.tsx",
        lineNumber: 9,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/theaters/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/theaters/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__96c7380c._.js.map