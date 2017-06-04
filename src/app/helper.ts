import Movie from '../models/movie';

export function classifyArticle(movie: Movie) {
    if (!movie.relatedArticles) return movie;
    const movieWithClassifyArticles = Object.assign({}, movie);
    var [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], []];
    movieWithClassifyArticles.relatedArticles.forEach((article) => {
        let title = article.title;
        if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
            goodRateArticles.push(article);
        } else if (title.indexOf('普雷') !== -1) {
            normalRateArticles.push(article)
        } else if (title.indexOf('負雷') !== -1) {
            badRateArticles.push(article)
        } else {
            otherArticles.push(article);
        }
    });
    movieWithClassifyArticles.goodRateArticles = goodRateArticles;
    movieWithClassifyArticles.normalRateArticles = normalRateArticles;
    movieWithClassifyArticles.badRateArticles = badRateArticles;
    movieWithClassifyArticles.otherArticles = otherArticles;
    return movieWithClassifyArticles;
}

export function getClientGeoLocation(): Promise<Coordinates> {
    return new Promise((reslove, reject) =>
        window.navigator.geolocation.getCurrentPosition(
            (pos) => reslove(pos.coords),
            reject,
            { timeout: 10000 }
        ));
}

export function getDistanceInKM(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = getRadians(lat2 - lat1);  // Javascript functions in radians
    var dLon = getRadians(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(getRadians(lat1)) * Math.cos(getRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Math.round(d * 10) / 10;
}

function getRadians(num) {
    return (num) * Math.PI / 180;
}