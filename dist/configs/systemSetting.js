"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://acmLab1001:6RsEeqp9FfKJ@movierater-shard-00-00.t36sx.mongodb.net:27017,movierater-shard-00-01.t36sx.mongodb.net:27017,movierater-shard-00-02.t36sx.mongodb.net:27017/movierater?ssl=true&replicaSet=atlas-aqn4du-shard-0&authSource=admin&retryWrites=true&w=majority',
    // dbUrl : 'mongodb://localhost:27017/movierater',
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL === 'true',
    enableScheduler: process.env.ENABLE_SCHEDULER === 'true',
    isProduction: process.env.NODE_ENV === "production",
    keepAlive: process.env.KEEP_ALIVE === "true",
    redisUrlForApiCache: process.env.REDIS_URL || "redis://redistogo:0682398920455ac9f8d245e5cba8998e@greeneye.redistogo.com:11238/",
    redisUrlForScheduler: process.env.REDISCLOUD_URL || "redis://redistogo:0682398920455ac9f8d245e5cba8998e@greeneye.redistogo.com:11238/"
};
exports.schedulerSetting = {
    pttPagePerTime: 50,
    yahooPagePerTime: 50
};
exports.googleApiSetting = {
    directionApiKey: 'AIzaSyDQ7FKQW10TIxKmbe7Tjc6fAXI3OQZh-No',
    geoApiKey: 'AIzaSyBcj5gbydKX6IdPnSxqDUwTTzlszB7oZVw'
};
console.log("systemSetting", JSON.stringify(exports.systemSetting));
//# sourceMappingURL=systemSetting.js.map