export const systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27018/movierater',
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL === 'true',
    enableScheduler: process.env.ENABLE_SCHEDULER === 'true',
    isProduction: process.env.NODE_ENV === "production",
    keepAlive: process.env.KEEP_ALIVE === "true",
    redisUrlForApiCache: process.env.REDIS_URL || "redis://localhost:6380/",
    redisUrlForScheduler: process.env.REDISCLOUD_URL || "redis://localhost:6380/"
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