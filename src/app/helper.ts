import Movie from '../models/movie';

export function classifyArticle(movie: Movie) {
  if (!movie || !movie.relatedArticles) return movie;
  const movieWithClassifyArticles = Object.assign({}, movie);
  var [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], []];
  movieWithClassifyArticles.relatedArticles.forEach((article) => {
    let title = article.title;
    if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
      goodRateArticles.push(article);
    } else if (title.indexOf('普雷') !== -1) {
      normalRateArticles.push(article);
    } else if (title.indexOf('負雷') !== -1) {
      badRateArticles.push(article);
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
    window.navigator.geolocation.getCurrentPosition((pos) => reslove(pos.coords), reject, { timeout: 10000 })
  );
}

export function getDistanceInKM(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = getRadians(lat2 - lat1); // Javascript functions in radians
  var dLon = getRadians(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(getRadians(lat1)) * Math.cos(getRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

function getRadians(num) {
  return (num * Math.PI) / 180;
}

const defaultRating = 3.5; // Default rating on a 0-5 scale (equivalent to 7 on a 0-10 scale)

export function getMovieSchema(movie: Movie) {
  const goodCount = movie.goodRateArticles.length;
  const badCount = movie.badRateArticles.length;
  const normalCount = movie.normalRateArticles.length;
  const totalArticles = goodCount + badCount + normalCount;

  // Calculate the ratings on a 0-5 scale
  const pttRating = calculateClampedRating(
    (goodCount * 10 + normalCount * 7 - badCount * 2) / totalArticles / 2 || // Divide by 2 to map to 0-5
      defaultRating,
    { min: 0, max: 5 }
  );

  const imdbRating = calculateClampedRating(parseFloat(movie.imdbRating) / 2 || defaultRating, { min: 0, max: 5 });
  const lineRating = calculateClampedRating(parseFloat(movie.lineRating) / 2 || defaultRating, { min: 0, max: 5 });

  // Calculate the aggregate rating on a 0-5 scale
  const aggregateRating = calculateClampedRating((imdbRating + lineRating + pttRating) / 3, { min: 0, max: 5 });

  return {
    '@context': 'http://schema.org',
    '@type': 'Movie',
    name: `${movie.chineseTitle} ${movie.englishTitle}`,
    image: movie.posterUrl,
    url: 'https://www.mvrater.com/movie/' + movie.movieBaseId,
    datePublished: movie.releaseDate,
    actor: {
      '@type': 'Person',
      name: movie.actors.join(','),
    },
    director: {
      '@type': 'Person',
      name: movie.directors.join(','),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.toFixed(1),
      ratingCount: totalArticles + 2,
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Organization',
          name: 'IMDb',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: imdbRating.toFixed(1),
        },
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Organization',
          name: 'LINE電影',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: lineRating.toFixed(1),
        },
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Organization',
          name: 'PTT',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: pttRating.toFixed(1),
        },
      },
    ],
  };
}

// Helper function to calculate and clamp a rating within a given range
function calculateClampedRating(value, range) {
  return Math.min(Math.max(value, range.min), range.max);
}
