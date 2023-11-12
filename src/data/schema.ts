import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt } from 'graphql';
import cacheManager from '../data/cacheManager';
import Movie from '../models/movie';
import Schedule from '../models/schedule';
import * as moment from 'moment';
import { findMoviesBy } from './findMoviesBy';
import { ObjectId } from 'mongodb';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'query...',
  fields: () => ({
    allMoviesNames: {
      type: new GraphQLList(autoCompleteType),
      description: 'Array of movie names, value: movieBaseId, text: chineseTitle',
      resolve: (root, args) => cacheManager.get(cacheManager.All_MOVIES_NAMES),
    },
    movies: {
      type: new GraphQLList(MovieType),
      args: {
        ids: { type: new GraphQLList(GraphQLID) },
        range: { type: GraphQLString },
      },
      resolve: async (root, { ids, range }: { ids: [string]; range: string }) => {
        if (ids) {
          const allMovies: Array<Movie> = cacheManager.get(cacheManager.All_MOVIES);
          const isMovieBaseId = ObjectId.isValid(ids[0]);
          return findMoviesBy(allMovies, ids, isMovieBaseId ? 'movieBaseId' : 'yahooId');
        } else if (range === 'upcoming') {
          let today = moment();
          let nintyDaysAfter = moment().add(90, 'days');
          let futureMovies = cacheManager
            .get(cacheManager.All_MOVIES)
            .filter(({ releaseDate }: Movie) => moment(releaseDate).isBetween(today, nintyDaysAfter, 'day', '()')); // '(' means exclude
          return futureMovies;
        } else {
          return cacheManager.get(cacheManager.RECENT_MOVIES);
        }
      },
    },
    theaters: {
      type: new GraphQLList(TheaterType),
      args: {
        name: { type: GraphQLString },
      },
      resolve: (root, { name: queryTheaterName }) => {
        let theaters = cacheManager.get(cacheManager.THEATERS);
        if (queryTheaterName) {
          return theaters.filter(({ name }) => name === queryTheaterName);
        }
        return theaters;
      },
    },
  }),
});

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  description: '...',
  fields: () => ({
    movieBaseId: {
      type: GraphQLID,
      resolve: (obj) => obj.movieBaseId,
    },
    lineMovieId: {
      type: GraphQLString,
      description: 'line movie id',
      resolve: (obj) => obj.lineMovieId,
    },
    lineUrlHash: {
      type: GraphQLString,
      description: 'line movie url hash',
      resolve: (obj) => obj.lineUrlHash,
    },
    yahooId: {
      type: GraphQLInt,
      description: 'yahoo movie id',
      resolve: (obj) => obj.yahooId,
    },
    posterUrl: {
      type: GraphQLString,
      description: 'poster image url',
      resolve: (obj) => obj.posterUrl,
    },
    summary: {
      type: GraphQLString,
      resolve: (obj) => obj.summary,
    },
    briefSummary: {
      type: GraphQLString,
      resolve: (obj) => (obj.summary && obj.summary.length > 70 ? obj.summary.substr(0, 70) + '...' : obj.summary),
    },
    chineseTitle: {
      type: GraphQLString,
      resolve: (obj) => obj.chineseTitle,
    },
    englishTitle: {
      type: GraphQLString,
      resolve: (obj) => obj.englishTitle,
    },
    releaseDate: {
      type: GraphQLString,
      resolve: (obj) => obj.releaseDate,
    },
    types: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj) => obj.types || [],
    },
    runTime: {
      type: GraphQLString,
      resolve: (obj) => obj.runTime,
    },
    directors: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj) => obj.directors || [],
    },
    actors: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj) => obj.actors || [],
    },
    launchCompany: {
      type: GraphQLString,
      resolve: (obj) => obj.launchCompany,
    },
    companyUrl: {
      type: GraphQLString,
      resolve: (obj) => obj.companyUrl,
    },
    goodRateArticles: {
      type: new GraphQLList(ArticleType),
      resolve: (obj) => obj.goodRateArticles,
    },
    normalRateArticles: {
      type: new GraphQLList(ArticleType),
      resolve: (obj) => obj.normalRateArticles,
    },
    badRateArticles: {
      type: new GraphQLList(ArticleType),
      resolve: (obj) => obj.badRateArticles,
    },
    otherArticles: {
      type: new GraphQLList(ArticleType),
      resolve: (obj) => obj.otherArticles,
    },
    relatedArticles: {
      type: new GraphQLList(ArticleType),
      resolve: (obj) => obj.relatedArticles,
    },
    imdbID: {
      type: GraphQLString,
      resolve: (obj) => obj.imdbID,
    },
    yahooRating: {
      type: GraphQLString,
      resolve: (obj) => obj.yahooRating,
    },
    lineRating: {
      type: GraphQLString,
      resolve: (obj) => obj.lineRating,
    },
    imdbRating: {
      type: GraphQLString,
      resolve: (obj) => obj.imdbRating,
    },
    tomatoRating: {
      type: GraphQLString,
      resolve: (obj) => obj.tomatoRating,
    },
    tomatoURL: {
      type: GraphQLString,
      resolve: (obj) => obj.tomatoURL,
    },
    schedules: {
      type: new GraphQLList(scheduleType),
      resolve: async (obj) => {
        const moviesSchedules = cacheManager.get(cacheManager.MOVIES_SCHEDULES) || [];
        return moviesSchedules.filter((schedule: Schedule) => schedule.movieName == obj.chineseTitle);
      },
    },
  }),
});

const ArticleType = new GraphQLObjectType({
  name: 'article',
  description: 'ptt articles',
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: (obj) => obj.title,
    },
    push: {
      type: GraphQLString,
      resolve: (obj) => obj.push,
    },
    url: {
      type: GraphQLString,
      resolve: (obj) => obj.url,
    },
    date: {
      type: GraphQLString,
      resolve: (obj) => obj.date,
    },
    author: {
      type: GraphQLString,
      resolve: (obj) => obj.author,
    },
  }),
});

const autoCompleteType = new GraphQLObjectType({
  name: 'autoCompleteType',
  fields: () => ({
    value: {
      type: GraphQLString,
      resolve: (obj) => obj.value,
    },
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
  }),
});

const scheduleType = new GraphQLObjectType({
  name: 'scheduleType',
  fields: () => ({
    date: {
      type: GraphQLString,
      resolve: (obj) => obj.date,
    },
    theaterName: {
      type: GraphQLString,
      resolve: (obj) => obj.theaterName,
    },
    movie: {
      type: MovieType,
      resolve: (obj: Schedule) =>
        cacheManager
          .get(cacheManager.All_MOVIES)
          .find(({ chineseTitle, lineMovieId }: Movie) => obj.movieName === chineseTitle && Boolean(lineMovieId)),
    },
    timesValues: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj) => obj.timesValues,
    },
    timesStrings: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj) => obj.timesStrings,
    },
    roomTypes: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj) => obj.roomTypes,
    },
    theaterExtension: {
      type: TheaterType,
      resolve: (obj: Schedule) => {
        return cacheManager.get(cacheManager.THEATERS).find(({ scheduleUrl }) => scheduleUrl === obj.scheduleUrl);
      },
    },
  }),
});

const TheaterType = new GraphQLObjectType({
  name: 'Theater',
  description: 'Theater in Taiwan with google location',
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: (obj) => obj.name,
    },
    address: {
      type: GraphQLString,
      resolve: (obj) => obj.address,
    },
    url: {
      type: GraphQLString,
      resolve: (obj) => obj.url,
    },
    phone: {
      type: GraphQLString,
      resolve: (obj) => obj.phone,
    },
    region: {
      type: GraphQLString,
      resolve: (obj) => obj.region,
    },
    regionIndex: {
      type: GraphQLString,
      resolve: (obj) => obj.regionIndex,
    },
    subRegion: {
      type: GraphQLString,
      resolve: (obj) => obj.subRegion,
    },
    location: {
      type: LocationType,
      resolve: (obj) => obj.location,
    },
    schedules: {
      type: new GraphQLList(scheduleType),
      resolve: (obj) => {
        let movieSchedules = cacheManager.get(cacheManager.MOVIES_SCHEDULES) || [];
        movieSchedules = movieSchedules.filter(({ scheduleUrl }: Schedule) => {
          return scheduleUrl === obj.scheduleUrl;
        });
        return movieSchedules;
      },
    },
  }),
});

const LocationType = new GraphQLObjectType({
  name: 'location',
  description: 'geo location from google',
  fields: () => ({
    lat: {
      type: GraphQLString,
      resolve: (obj) => obj.lat,
    },
    lng: {
      type: GraphQLString,
      resolve: (obj) => obj.lng,
    },
    place_id: {
      type: GraphQLString,
      resolve: (obj) => obj.place_id,
    },
  }),
});

export default new GraphQLSchema({
  query: QueryType,
});
