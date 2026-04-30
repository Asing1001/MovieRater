module.exports = [
"[externals]/node-cron [external] (node-cron, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node-cron", () => require("node-cron"));

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
"[project]/src/helper/util.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCheerio$",
    ()=>getCheerio$
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/load-parse.js [instrumentation] (ecmascript)");
;
async function getCheerio$(url) {
    const response = await fetch(url);
    const html = await response.text();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["load"](html, {
        decodeEntities: false
    });
}
}),
"[project]/src/crawler/theaterCrawler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRegionList",
    ()=>getRegionList,
    "getTheaterList",
    ()=>getTheaterList,
    "getTheaterListByRegion",
    ()=>getTheaterListByRegion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/util.ts [instrumentation] (ecmascript)");
;
const theaterListUrl = 'http://www.atmovies.com.tw/showtime/';
async function getTheaterList() {
    console.time('getTheaterList');
    const regionList = await getRegionList();
    const promises = regionList.map(getTheaterListByRegion);
    const theaterList = [].concat(...await Promise.all(promises));
    console.timeEnd('getTheaterList');
    return theaterList;
}
async function getRegionList() {
    const $ = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getCheerio$"])(theaterListUrl);
    const regionList = Array.from($('map > [shape=rect]')).map((area)=>{
        const $area = $(area);
        return {
            name: $area.attr('alt'),
            regionId: $area.attr('href').substr(theaterListUrl.length, 3)
        };
    });
    return regionList;
}
async function getTheaterListByRegion({ name: regionName, regionId }, index) {
    const $ = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getCheerio$"])(`${theaterListUrl}${regionId}/`);
    const theaterList = [];
    let subRegion = regionName;
    Array.from($('#theaterList>li')).forEach((li)=>{
        const $li = $(li);
        if ($li.hasClass('type0')) {
            subRegion = $li.text().trim().slice(0, -1);
        } else {
            theaterList.push({
                name: $li.find('a').first().text().trim(),
                url: $li.find('a[target]').attr('href'),
                scheduleUrl: $li.find('a').attr('href'),
                address: $li.find('li').first().text().trim(),
                phone: $li.find('li:nth-child(2)').text().trim(),
                region: regionName,
                regionIndex: index.toString(),
                subRegion
            });
        }
    });
    return theaterList;
}
}),
"[project]/src/crawler/yahooCrawler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getYahooMovieInfo",
    ()=>getYahooMovieInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/load-parse.js [instrumentation] (ecmascript)");
;
async function getYahooMovieInfo(yahooId) {
    const yahooMovieUrl = 'https://movies.yahoo.com.tw/movieinfo_main.html/id=' + yahooId;
    const response = await fetch(yahooMovieUrl, {
        redirect: 'manual'
    });
    if (response.status >= 300) {
        throw new Error(`${yahooMovieUrl} 404 not found`);
    }
    const body = await response.text();
    const $ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["load"](body, {
        decodeEntities: false
    });
    const $movieInfoDiv = $('.movie_intro_info_r');
    const $movieInfoValues = $movieInfoDiv.find('>span');
    const posterUrl = $('.movie_intro_foto>img').attr('src');
    const fullSummary = $('.gray_infobox_inner>span').attr('title2');
    const summary = fullSummary || $('.gray_infobox_inner>span').eq(0).html().trim();
    const imdbRatingMatch = /\d{1}\.?\d{1}?/.exec($movieInfoValues.eq(3).text());
    const movieInfo = {
        yahooId,
        posterUrl,
        chineseTitle: $movieInfoDiv.find('h1').text(),
        englishTitle: $movieInfoDiv.find('h3').eq(0).text(),
        releaseDate: $movieInfoValues.eq(0).text().split('：')[1],
        types: Array.from($movieInfoDiv.find('.level_name_box a')).map((a)=>$(a).text().trim()),
        runTime: $movieInfoValues.eq(1).text().split('：')[1],
        directors: $movieInfoDiv.find('.movie_intro_list').eq(0).text().replace('導演：', '').split('、').map((director)=>director.trim()),
        actors: $movieInfoDiv.find('.movie_intro_list').last().text().replace('演員：', '').split('、').map((director)=>director.trim()),
        launchCompany: $movieInfoValues.eq(2).text().split('：')[1],
        yahooRating: $('.score>.score_num').text(),
        imdbRating: imdbRatingMatch ? imdbRatingMatch[0] : '',
        summary
    };
    if (!movieInfo.chineseTitle) {
        throw new Error(`${yahooMovieUrl} can not find chineseTitle, data might got problem.`);
    }
    return movieInfo;
}
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
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
"[project]/src/models/location.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Location
]);
class Location {
    constructor(lat = '', lng = '', place_id = ''){
        this.lat = lat;
        this.lng = lng;
        this.place_id = place_id;
    }
    lat;
    lng;
    place_id;
}
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/thirdPartyIntegration/googleMapApi.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGeoLocation",
    ()=>getGeoLocation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/configs/systemSetting.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$location$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/location.ts [instrumentation] (ecmascript)");
;
;
function getGeoLocation(address) {
    return new Promise((resolve, reject)=>{
        let location = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$location$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"]();
        if (!address) {
            resolve(location);
        }
        var googleMapsClient = __turbopack_context__.r("[project]/node_modules/@google/maps/lib/index.js [instrumentation] (ecmascript)").createClient({
            key: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["googleApiSetting"].geoApiKey
        });
        googleMapsClient.geocode({
            address: address.split('(')[0],
            region: 'tw'
        }, function(err, response) {
            if (err) {
                reject(err);
                console.error(err);
            }
            const results = response.json.results;
            if (results && results.length > 0) {
                const result = results[0];
                location.lat = result.geometry.location.lat;
                location.lng = result.geometry.location.lng;
                location.place_id = result.place_id;
            } else {
                console.warn(`address:${address} not found, json.status:${response.json.status}`);
            }
            resolve(location);
        });
    });
}
}),
"[project]/src/task/yahooTask.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateTheaterWithLocationList",
    ()=>updateTheaterWithLocationList,
    "updateYahooMovies",
    ()=>updateYahooMovies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$theaterCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/theaterCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$yahooCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/yahooCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$thirdPartyIntegration$2f$googleMapApi$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/thirdPartyIntegration/googleMapApi.ts [instrumentation] (ecmascript)");
;
;
;
;
async function updateTheaterWithLocationList() {
    const theaterList = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$theaterCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getTheaterList"])();
    console.time('bindingTheaterListWithLocation');
    const theaterListWithLocation = await bindingTheaterListWithLocation(theaterList);
    console.timeEnd('bindingTheaterListWithLocation');
    return Promise.all(theaterListWithLocation.map((theater)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument({
            name: theater.name
        }, theater, 'theaters')));
}
function bindingTheaterListWithLocation(theaterList) {
    return Promise.all(theaterList.map(async (theater)=>{
        const location = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$thirdPartyIntegration$2f$googleMapApi$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getGeoLocation"])(theater.address);
        if (location.lat) {
            return Object.assign(theater, {
                location
            });
        }
        return theater;
    }));
}
async function updateYahooMovies(howManyPagePerTime) {
    const range = await getCurrentCrawlRange(howManyPagePerTime);
    const yahooMovies = await getRangeYahooMovies(range);
    updateMaxYahooId(yahooMovies, range.startYahooId);
    await Promise.all(yahooMovies.map((yahooMovie)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument({
            yahooId: yahooMovie.yahooId
        }, yahooMovie, 'yahooMovies')));
}
const crawlerStatusFilter = {
    name: 'crawlerStatus'
};
async function getCurrentCrawlRange(howManyPagePerTime) {
    const crawlerStatus = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getDocument(crawlerStatusFilter, 'configs');
    const startYahooId = crawlerStatus.lastCrawlYahooId + 1;
    return {
        startYahooId,
        endYahooId: startYahooId + howManyPagePerTime - 1
    };
}
async function getRangeYahooMovies({ startYahooId, endYahooId }) {
    const promises = [];
    for(let i = startYahooId; i <= endYahooId; i++){
        const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$yahooCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getYahooMovieInfo"])(i);
        promises.push(promise);
    }
    const results = await Promise.allSettled(promises);
    const yahooMovies = [];
    for (const result of results){
        if (result.status === 'fulfilled') {
            yahooMovies.push(result.value);
        } else {
            console.error(result.reason);
        }
    }
    return yahooMovies;
}
async function updateMaxYahooId(yahooMovies, startYahooId) {
    const movieIds = yahooMovies.map(({ yahooId })=>yahooId);
    const crawlerStatus = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getDocument(crawlerStatusFilter, 'configs');
    const maxCrawledYahooId = Math.max(...movieIds, startYahooId);
    const alreadyCrawlTheNewest = maxCrawledYahooId === startYahooId;
    if (alreadyCrawlTheNewest) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument(crawlerStatusFilter, {
            lastCrawlYahooId: 0
        }, 'configs');
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument(crawlerStatusFilter, {
            maxYahooId: Math.max(crawlerStatus.maxYahooId, maxCrawledYahooId),
            lastCrawlYahooId: maxCrawledYahooId
        }, 'configs');
    }
    console.log(`new movieInfo count:${yahooMovies.length}, lastCrawlYahooId:${maxCrawledYahooId}`);
}
}),
"[project]/src/crawler/lineCrawler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/crawler/movieSchduleCrawler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "crawlMovieSchdule",
    ()=>crawlMovieSchdule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/util.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
;
;
const movieSchduleUrl = 'http://www.atmovies.com.tw';
async function crawlMovieSchdule(scheduleUrl, date) {
    let schedules = [];
    const isToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])().format('YYYYMMDD') === date;
    const atmovieScheduleUrl = `${movieSchduleUrl + scheduleUrl}${isToday ? '' : date + '/'}`;
    try {
        const $ = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$util$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getCheerio$"])(atmovieScheduleUrl);
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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

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
"[project]/src/helper/chunk.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/helper/promiseMap.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "promiseMap",
    ()=>promiseMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$chunk$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/chunk.ts [instrumentation] (ecmascript)");
;
async function promiseMap(items, callback, options) {
    const { concurrency, delay } = options;
    const itemChunks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$chunk$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["chunk"])(items, concurrency);
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
"[project]/src/task/atmoviesTask.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMoviesSchedules",
    ()=>getMoviesSchedules,
    "updateMoviesSchedules",
    ()=>updateMoviesSchedules
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$movieSchduleCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/movieSchduleCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ioredis$2f$built$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ioredis/built/index.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/configs/systemSetting.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/promiseMap.ts [instrumentation] (ecmascript)");
;
;
;
;
;
;
const redisClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ioredis$2f$built$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["systemSetting"].redisUrlForScheduler);
redisClient.on('error', (err)=>console.log('Redis error: ' + err));
async function updateMoviesSchedules() {
    const scheduleUrls = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].db.collection('theaters').find({}, {
        projection: {
            scheduleUrl: 1,
            _id: 0
        }
    }).toArray();
    const scheduleCrawlDate = await getScheduleCrawlDate();
    console.log('scheduleCrawlDate', scheduleCrawlDate);
    const schedules = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["promiseMap"])(scheduleUrls, ({ scheduleUrl })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$movieSchduleCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["crawlMovieSchdule"])(scheduleUrl, scheduleCrawlDate), {
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
        multi.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])().add(i, 'days').format('YYYYMMDD'));
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
    const { scheduleDay: currentScheduleDay } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getDocument(crawlerStatusFilter, 'configs');
    if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
        resultDay = currentScheduleDay + 1;
    }
    UpdateScheduleCrawlDate(resultDay);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])().add(resultDay, 'days').format('YYYYMMDD');
}
function UpdateScheduleCrawlDate(day) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument(crawlerStatusFilter, {
        scheduleDay: day
    }, 'configs');
}
}),
"[project]/src/helper/isValideDate.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/data/cacheManager.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>cacheManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/lineCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/atmoviesTask.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$isValideDate$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/isValideDate.ts [instrumentation] (ecmascript)");
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["updateMoviesSchedules"])();
        await cacheManager.setMoviesSchedulesCache();
    }
    static async getMergedDatas() {
        console.time('Get mergedDatas');
        const mergedDatas = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getCollection({
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
        const theaterListWithLocation = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getCollection({
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
        const inTheaterResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getPlayingMovies"])();
        const inTheaterLineIds = inTheaterResponse.items.map((item)=>item.id);
        const hasInTheaterData = inTheaterLineIds && inTheaterLineIds.length;
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])();
        const recentMovies = cacheManager.get(cacheManager.All_MOVIES).filter(({ releaseDate, lineMovieId })=>{
            const hasLINEMovieId = Boolean(lineMovieId);
            const releaseMoment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$isValideDate$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(releaseDate) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(releaseDate) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])();
            return hasLINEMovieId && (!hasInTheaterData || inTheaterLineIds.indexOf(lineMovieId) !== -1) && today.diff(releaseMoment, 'days') <= 60;
        });
        cacheManager.set(cacheManager.RECENT_MOVIES, recentMovies);
        console.timeEnd('setRecentMoviesCache');
    }
    static async setMoviesSchedulesCache() {
        console.time('setMoviesSchedulesCache');
        try {
            const allSchedules = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getMoviesSchedules"])();
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
"[project]/src/crawler/pttCrawler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMatchedYahooId",
    ()=>getMatchedYahooId,
    "getPttPage",
    ()=>getPttPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/load-parse.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/cacheManager.ts [instrumentation] (ecmascript)");
;
;
;
async function getPttPage(index) {
    const pttPageUrl = `https://www.ptt.cc/bbs/movie/index${index}.html`;
    const response = await fetch(pttPageUrl);
    const html = await response.text();
    const $ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["load"](html);
    const $articleInfoDivs = $('.r-ent');
    if (!$articleInfoDivs.length) {
        const serverReturn = $('.bbs-screen.bbs-content').text() || `${response.status} - ${response.statusText}`;
        throw new Error(`index${index} not exist, server return:${serverReturn}`);
    }
    const articleInfos = Array.from($articleInfoDivs).map((articleInfoDiv)=>{
        let $articleInfoDiv = $(articleInfoDiv);
        let articleUrl = $articleInfoDiv.find('.title>a').attr('href');
        let articleHasDeleted = !articleUrl;
        let date = articleHasDeleted ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])().format('YYYY/MM/DD') : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(parseInt(articleUrl.split('.')[1]) * 1000).format('YYYY/MM/DD');
        let articleTitle = $articleInfoDiv.find('.title>a').text();
        const articleInfo = {
            title: articleTitle,
            push: $articleInfoDiv.find('.nrec>.hl').text(),
            url: articleUrl,
            date: date,
            author: $articleInfoDiv.find('.meta>.author').text()
        };
        return articleInfo;
    });
    return {
        pageIndex: index,
        url: pttPageUrl,
        articles: articleInfos
    };
}
function getMatchedYahooId(articleTitle, date) {
    let matchedYahooMovie = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].All_MOVIES).find((yahooMovie)=>{
        let releaseDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(yahooMovie.releaseDate);
        let releaseYear = releaseDate.year();
        let rangeStart = releaseDate.clone().subtract(3, 'months');
        let rangeEnd = releaseDate.clone().add(6, 'months');
        let articleFullDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(date, 'YYYY/MM/DD');
        let isInNearMonth = articleFullDate.isBetween(rangeStart, rangeEnd);
        let isChinesetitleMatch = articleTitle.indexOf(yahooMovie.chineseTitle) !== -1;
        return isChinesetitleMatch && isInNearMonth;
    });
    return matchedYahooMovie ? matchedYahooMovie.yahooId : null;
}
}),
"[project]/src/task/pttTask.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updatePttArticles",
    ()=>updatePttArticles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$pttCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/pttCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [instrumentation] (ecmascript)");
;
;
async function updatePttArticles(howManyPagePerTime) {
    const range = await getCurrentCrawlRange(howManyPagePerTime);
    const pttPages = await getRangePttPages(range);
    updateMaxPttIndex(pttPages, range.startPttIndex);
    let pttArticles = [].concat(...pttPages.map(({ articles })=>articles));
    await Promise.all(pttArticles.map((pttArticle)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument({
            url: pttArticle.url
        }, pttArticle, 'pttArticles')));
}
const crawlerStatusFilter = {
    name: 'crawlerStatus'
};
async function getCurrentCrawlRange(howManyPagePerTime) {
    const crawlerStatus = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getDocument(crawlerStatusFilter, 'configs');
    const startPttIndex = crawlerStatus.lastCrawlPttIndex + 1;
    return {
        startPttIndex,
        endPttIndex: startPttIndex + howManyPagePerTime - 1
    };
}
async function getRangePttPages({ startPttIndex, endPttIndex }) {
    const promises = [];
    for(let i = startPttIndex; i <= endPttIndex; i++){
        const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$pttCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getPttPage"])(i);
        promises.push(promise);
    }
    const results = await Promise.allSettled(promises);
    let pttPages = [];
    results.forEach((result)=>{
        if (result.status === 'fulfilled') {
            pttPages.push(result.value);
        } else {
            console.error(result.reason);
        }
    });
    return pttPages;
}
async function updateMaxPttIndex(pttPages, startPttIndex) {
    const pttIndexs = pttPages.map(({ pageIndex })=>pageIndex);
    const crawlerStatus = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].getDocument(crawlerStatusFilter, 'configs');
    const maxCrawledPttIndex = Math.max(...pttIndexs, startPttIndex);
    const alreadyCrawlTheNewest = maxCrawledPttIndex === startPttIndex;
    if (alreadyCrawlTheNewest) {
        const lastCrawlPttIndex = maxCrawledPttIndex - 100 > 0 ? maxCrawledPttIndex - 100 : 0;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument(crawlerStatusFilter, {
            lastCrawlPttIndex
        }, 'configs');
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument(crawlerStatusFilter, {
            maxPttIndex: Math.max(maxCrawledPttIndex, crawlerStatus.maxPttIndex),
            lastCrawlPttIndex: maxCrawledPttIndex
        }, 'configs');
    }
    console.log(`new pttPages count:${pttPages.length}, lastCrawlPttIndex:${maxCrawledPttIndex}`);
}
}),
"[project]/src/crawler/imdbCrawler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getIMDBMovieInfo",
    ()=>getIMDBMovieInfo,
    "getIMDBRating",
    ()=>getIMDBRating,
    "getIMDBRatingFromHtml",
    ()=>getIMDBRatingFromHtml,
    "getIMDBSuggestId",
    ()=>getIMDBSuggestId,
    "getIMDBSuggestIdFromSuggestions",
    ()=>getIMDBSuggestIdFromSuggestions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$index$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/index.js [instrumentation] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cheerio/dist/esm/load-parse.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
;
;
async function getIMDBMovieInfo(movie) {
    try {
        const imdbID = await getIMDBSuggestId(movie);
        if (!imdbID) {
            return null;
        }
        const imdbRating = await getIMDBRating(imdbID);
        return {
            imdbID,
            imdbRating
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}
async function getIMDBSuggestId({ englishTitle, releaseDate }) {
    const imdbSuggestJsonUrl = getIMDBSuggestJsonUrl(englishTitle);
    const response = await fetch(imdbSuggestJsonUrl);
    const suggestions = await response.json();
    return getIMDBSuggestIdFromSuggestions(suggestions, englishTitle, releaseDate);
}
function getIMDBSuggestIdFromSuggestions(suggestions, englishTitle, releaseDate) {
    if (suggestions && suggestions.d && suggestions.d.length) {
        const releaseYear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(releaseDate).year();
        const correctMovie = suggestions.d.find(({ y: year, l: title })=>{
            const similarity = getSimilarity(title, englishTitle);
            return similarity > 0.8 || similarity > 0.6 && year === releaseYear;
        });
        if (correctMovie && correctMovie.id) {
            return correctMovie.id;
        }
    }
    return null;
}
// For example, the suggestionUrl of the movie "girl's revenge" is https://v2.sg.media-imdb.com/suggestion/g/girls_revenge.json
function getIMDBSuggestJsonUrl(englishTitle) {
    const jsonName = englishTitle.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_").substr(0, 20);
    return `https://v2.sg.media-imdb.com/suggestion/${jsonName.charAt(0)}/${jsonName}.json`;
}
const imdbMobileMovieUrl = 'https://m.imdb.com/title/';
async function getIMDBRating(imdbID) {
    if (!imdbID) {
        return null;
    }
    const response = await fetch(`${imdbMobileMovieUrl}${imdbID}/`);
    const html = await response.text();
    return getIMDBRatingFromHtml(html);
}
function getIMDBRatingFromHtml(html) {
    const $ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cheerio$2f$dist$2f$esm$2f$load$2d$parse$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["load"](html);
    return $('[data-testid="hero-rating-bar__aggregate-rating__score"] > span').first().text();
}
function getSimilarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    var costs = new Array();
    for(var i = 0; i <= s1.length; i++){
        var lastValue = i;
        for(var j = 0; j <= s2.length; j++){
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
}),
"[project]/src/task/imdbTask.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateImdbInfo",
    ()=>updateImdbInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/cacheManager.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$imdbCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/imdbCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/promiseMap.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
;
;
;
;
;
async function updateImdbInfo() {
    const movieInfos = await getNewImdbInfos();
    logResult(movieInfos);
    await updateNewImdbInfos(movieInfos);
}
const imdbLastCrawlTimeFormat = 'YYYY-MM-DDTHH';
async function getNewImdbInfos() {
    const imdbLastCrawlTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])().format(imdbLastCrawlTimeFormat);
    const allMovies = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].All_MOVIES);
    const toCrawlMovies = allMovies.filter(filterNeedCrawlMovie);
    console.log('getNewImdbInfos ~ toCrawlMovies length:', toCrawlMovies.length);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["promiseMap"])(toCrawlMovies, async (movie)=>{
        const imdbInfo = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$imdbCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getIMDBMovieInfo"])(movie);
        const movieInfo = {
            movieBaseId: movie.movieBaseId,
            ...imdbInfo,
            imdbLastCrawlTime
        };
        return movieInfo;
    }, {
        concurrency: 5,
        delay: 500
    });
}
function filterNeedCrawlMovie({ englishTitle, releaseDate, imdbID, imdbRating, imdbLastCrawlTime }) {
    const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])();
    const isRecentMovie = now.diff((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(releaseDate), 'months') <= 6;
    const dataJustCrawled = imdbID && imdbRating && now.diff((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(imdbLastCrawlTime), 'days') <= 7;
    const shouldCrawl = !dataJustCrawled && englishTitle && isRecentMovie;
    return shouldCrawl;
}
function logResult(movieInfos) {
    const foundMovies = movieInfos.filter((movie)=>movie.imdbID);
    const notfoundMovieIds = movieInfos.filter((movie)=>!movie.imdbID).map((movie)=>movie.movieBaseId);
    console.log(`Found imdbInfos: ${foundMovies.length}, NotFound: ${notfoundMovieIds.length}`);
    console.log(`Not found YahooIds: ${notfoundMovieIds}`);
}
async function updateNewImdbInfos(movieInfos) {
    var promises = movieInfos.map(({ movieBaseId, imdbID, imdbRating, imdbLastCrawlTime })=>{
        const newInfo = imdbID ? {
            imdbID,
            imdbRating,
            imdbLastCrawlTime
        } : {
            imdbLastCrawlTime
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument({
            _id: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["ObjectId"](movieBaseId)
        }, newInfo, 'yahooMovies');
    });
    await Promise.all(promises);
}
}),
"[project]/src/task/lineTask.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateLINEMovies",
    ()=>updateLINEMovies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/crawler/lineCrawler.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/db.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/helper/promiseMap.ts [instrumentation] (ecmascript)");
;
;
;
;
async function updateLINEMovies() {
    const playingMovies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getPlayingMovies"])();
    console.log('Got playingMovies, total count:', playingMovies.totalCount);
    const movies = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$helper$2f$promiseMap$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["promiseMap"])(playingMovies.items, async (item)=>{
        const movie = await mapToYahooMovieModel(item);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$db$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["Mongo"].updateDocument({
            lineMovieId: movie.lineMovieId
        }, movie, 'yahooMovies');
        return movie;
    }, {
        concurrency: 10
    });
    console.log('Updated LINEMovies success.');
    return movies;
}
async function mapToYahooMovieModel(item) {
    const lineRating = item.rating ? item.rating.average.toFixed(1) : undefined;
    const movie = {
        lineMovieId: item.id,
        lineUrlHash: item.url && item.url.hash || null,
        posterUrl: item.thumbnail && `https://obs.line-scdn.net/${item.thumbnail.hash}/w280` || null,
        chineseTitle: item.title,
        englishTitle: item.engTitle,
        releaseDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"])(item.releaseDate).format('YYYY-MM-DD'),
        types: item.genres,
        runTime: item.runtime && item.runtime.toString(),
        directors: item.directors,
        actors: item.cast,
        launchCompany: item.production,
        lineRating: lineRating,
        summary: item.synopsis,
        lineTrailerHash: await getLINETrailerHash(item)
    };
    return movie;
}
async function getLINETrailerHash(item) {
    // if the trailer type is not video, get article from trailer url hash, and then get the response.data.media.hash
    try {
        if (item.mainTrailer) {
            const trailer = item.mainTrailer;
            const lineTrailerThumbnail = trailer.thumbnail;
            if (lineTrailerThumbnail && lineTrailerThumbnail.type === 'VIDEO') {
                return lineTrailerThumbnail.hash || null;
            } else if (trailer.url && trailer.url.hash) {
                const article = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$crawler$2f$lineCrawler$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["getLINEArticle"])(trailer.url.hash);
                return article.data.media.hash || null;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}
}),
"[project]/src/backgroundService/scheduler.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initScheduler",
    ()=>initScheduler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node-cron [external] (node-cron, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/configs/systemSetting.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$yahooTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/yahooTask.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$pttTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/pttTask.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$imdbTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/imdbTask.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/cacheManager.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/atmoviesTask.ts [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$lineTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/task/lineTask.ts [instrumentation] (ecmascript)");
;
;
;
;
;
;
;
;
function initScheduler() {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["systemSetting"].enableScheduler) {
        return;
    }
    console.log('[Scheduler] init');
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__["schedule"]('10 * * * *', async ()=>{
        console.time('[Scheduler] updateLINEMovies');
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$lineTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["updateLINEMovies"])();
        console.timeEnd('[Scheduler] updateLINEMovies');
    });
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__["schedule"]('15 * * * *', async ()=>{
        console.time('[Scheduler] updatePttArticles');
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$pttTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["updatePttArticles"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$configs$2f$systemSetting$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["schedulerSetting"].pttPagePerTime);
        console.timeEnd('[Scheduler] updatePttArticles');
    });
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__["schedule"]('20 * * * *', async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].setRecentMoviesCache();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$atmoviesTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["updateMoviesSchedules"])();
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].setMoviesSchedulesCache();
    });
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__["schedule"]('30 5 * * *', async ()=>{
        console.time('[Scheduler] updateTheaterWithLocationList');
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$yahooTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["updateTheaterWithLocationList"])();
        console.timeEnd('[Scheduler] updateTheaterWithLocationList');
    });
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__["schedule"]('40 5 * * *', async ()=>{
        console.time('[Scheduler] cacheManager.init');
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$cacheManager$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["default"].init();
        console.timeEnd('[Scheduler] cacheManager.init');
    });
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__cjs$29$__["schedule"]('30 6 * * *', async ()=>{
        console.time('[Scheduler] updateImdbInfo');
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$task$2f$imdbTask$2e$ts__$5b$instrumentation$5d$__$28$ecmascript$29$__["updateImdbInfo"])();
        console.timeEnd('[Scheduler] updateImdbInfo');
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__24a12bb0._.js.map