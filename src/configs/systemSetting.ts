const isProduction = process.env.ENV === 'production';

export const systemSetting = {
    dbUrl: 'mongodb://acmLab1001:MtOURxGiU2SL@ds117109.mlab.com:17109/movieraterprd',
    websiteUrls: ['http://movierater.azurewebsites.net/'],
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
