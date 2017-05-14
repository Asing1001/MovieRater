"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater',
    //dbUrl : 'mongodb://localhost:27017/movierater'
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL,
    enableScheduler: true
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