const isProduction = process.env.ENV === 'production';

export const systemSetting = {
    dbUrl: process.env.DB_URL || 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater',
    //dbUrl : 'mongodb://localhost:27017/movierater'
    websiteUrl: process.env.WEBSITE_URL,
    enableGraphiql: process.env.ENABLE_GRAPHIQL
}

export const pttCrawlerSetting = {
    enable: false,
    startPttIndex: 4000,
    howManyPagePerTime: 30
}

export const yahooCrawlerSetting = {
    enable: false,
    startYahooId: 6100,
    howManyPagePerTime: 30,
}

console.log("systemSetting", JSON.stringify(systemSetting));