const isProduction = process.env.ENV === 'production';

export const systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater',
    //dbUrl : 'mongodb://localhost:27017/movierater'
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL,
    REDIS_URL: 'redis://h:pb1d6015e875c2a0e81aa7129a47435b4a9e53305eec1a3e36626ffcae875d44b@ec2-34-206-56-226.compute-1.amazonaws.com:28819'
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