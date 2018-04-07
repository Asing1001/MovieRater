export const systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater',
    // dbUrl : 'mongodb://localhost:27017/movierater',
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL === 'true',
    enableScheduler: process.env.ENABLE_SCHEDULER === 'true',
    isProduction: process.env.NODE_ENV === "production",
    keepAlive: process.env.KEEP_ALIVE,
    redisUrlForApiCache: process.env.REDIS_URL || "redis://redistogo:0682398920455ac9f8d245e5cba8998e@greeneye.redistogo.com:11238/",
}

export const schedulerSetting = {
    pttPagePerTime: 50,
    yahooPagePerTime: 50
}

export const googleApiSetting = {
    directionApiKey: 'AIzaSyDQ7FKQW10TIxKmbe7Tjc6fAXI3OQZh-No',
    geoApiKey: 'AIzaSyBcj5gbydKX6IdPnSxqDUwTTzlszB7oZVw'
}

console.log("systemSetting", JSON.stringify(systemSetting));