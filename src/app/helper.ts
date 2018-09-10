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

export function getMovieSchema(movie: Movie) {
    const pttRating = (movie.goodRateArticles.length * 5 / (movie.goodRateArticles.length + movie.badRateArticles.length)) || 3
    const imdbRating = parseFloat(movie.imdbRating)/2 || 3
    const yahooRating = parseFloat(movie.yahooRating) || 3
    const aggregateRating = (imdbRating + yahooRating + pttRating) / 3
    return {
        "@context": "http://schema.org",
        "@type": "Movie",
        "name": `${movie.chineseTitle} ${movie.englishTitle}`,
        "image": movie.posterUrl,
        "url": "https://www.mvrater.com/movie/" + movie.yahooId,
        "datePublished": movie.releaseDate,
        "actor": {
            "@type": "Person",
            "name": movie.actors.join(',')
        },
        "director": {
            "@type": "Person",
            "name": movie.directors.join(',')
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": aggregateRating,
            "ratingCount": "3",
        },
        "review": [{
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "IMDb"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": imdbRating,
            }
        }, {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "Yahoo"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": yahooRating,
            }
        }, {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "PTT"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": pttRating,
            }
        }]
    }
}