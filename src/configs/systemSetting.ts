const isProduction = process.env.ENV === 'production';

export const systemSetting = {
    dbUrl: 'mongodb://acmLab1001:6RsEeqp9FfKJ@ds145415.mlab.com:45415/movierater',
    websiteUrls: ['http://movieqat.azurewebsites.net/', 'http://movierater.azurewebsites.net/'],
    //dbUrl : 'mongodb://localhost:27017/movierater'
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
