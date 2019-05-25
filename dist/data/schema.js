"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const cacheManager_1 = require("../data/cacheManager");
const moment = require("moment");
const QueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    description: 'query...',
    fields: () => ({
        allMoviesNames: {
            type: new graphql_1.GraphQLList(autoCompleteType),
            description: 'Array of movie names, key:yahooId, value:chineseTitle or englishTitles',
            resolve: (root, args) => cacheManager_1.default.get(cacheManager_1.default.All_MOVIES_NAMES)
        },
        movies: {
            type: new graphql_1.GraphQLList(MovieType),
            args: {
                yahooIds: { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) },
                range: { type: graphql_1.GraphQLString }
            },
            resolve: (root, { yahooIds, range }) => __awaiter(this, void 0, void 0, function* () {
                if (yahooIds) {
                    const allMovies = cacheManager_1.default.get("allMovies");
                    return allMovies.filter(({ yahooId }) => yahooIds.indexOf(yahooId) !== -1);
                }
                else if (range === 'upcoming') {
                    let today = moment();
                    let nintyDaysAfter = moment().add(90, 'days');
                    let futureMovies = cacheManager_1.default.get(cacheManager_1.default.All_MOVIES)
                        .filter(({ yahooId, releaseDate }) => moment(releaseDate).isBetween(today, nintyDaysAfter, 'day', '()')); // '(' means exclude
                    return futureMovies;
                }
                else {
                    return cacheManager_1.default.get(cacheManager_1.default.RECENT_MOVIES);
                }
            }),
        },
        theaters: {
            type: new graphql_1.GraphQLList(TheaterType),
            args: {
                name: { type: graphql_1.GraphQLString }
            },
            resolve: (root, { name: queryTheaterName }) => {
                let theaters = cacheManager_1.default.get(cacheManager_1.default.THEATERS);
                if (queryTheaterName) {
                    return theaters.filter(({ name }) => name === queryTheaterName);
                }
                return theaters;
            }
        },
    }),
});
const MovieType = new graphql_1.GraphQLObjectType({
    name: 'Movie',
    description: '...',
    fields: () => ({
        yahooId: {
            type: graphql_1.GraphQLInt,
            description: 'yahoo movie id',
            resolve: obj => obj.yahooId,
        },
        posterUrl: {
            type: graphql_1.GraphQLString,
            description: 'poster image url',
            resolve: obj => obj.posterUrl,
        },
        summary: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.summary,
        },
        briefSummary: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.summary && obj.summary.length > 70 ? obj.summary.substr(0, 70) + '...' : obj.summary,
        },
        chineseTitle: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.chineseTitle,
        },
        englishTitle: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.englishTitle,
        },
        releaseDate: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.releaseDate,
        },
        types: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.types || [],
        },
        runTime: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.runTime,
        },
        directors: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.directors || [],
        },
        actors: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.actors || [],
        },
        launchCompany: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.launchCompany,
        },
        companyUrl: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.companyUrl,
        },
        goodRateArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: obj => obj.goodRateArticles,
        },
        normalRateArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: obj => obj.normalRateArticles,
        },
        badRateArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: obj => obj.badRateArticles,
        },
        otherArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: obj => obj.otherArticles,
        },
        relatedArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: obj => obj.relatedArticles,
        },
        imdbID: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.imdbID,
        },
        yahooRating: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.yahooRating,
        },
        imdbRating: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.imdbRating,
        },
        tomatoRating: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.tomatoRating,
        },
        tomatoURL: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.tomatoURL,
        },
        schedules: {
            type: new graphql_1.GraphQLList(scheduleType),
            resolve: (obj) => __awaiter(this, void 0, void 0, function* () {
                const moviesSchedules = cacheManager_1.default.get(cacheManager_1.default.MOVIES_SCHEDULES) || [];
                return moviesSchedules.filter((schedule) => schedule.movieName == obj.chineseTitle);
            }),
        }
    })
});
const ArticleType = new graphql_1.GraphQLObjectType({
    name: 'article',
    description: 'ptt articles',
    fields: () => ({
        title: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.title,
        },
        push: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.push,
        },
        url: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.url,
        },
        date: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.date,
        },
        author: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.author,
        },
    })
});
const autoCompleteType = new graphql_1.GraphQLObjectType({
    name: "autoCompleteType",
    fields: () => ({
        value: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.value,
        },
        text: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.text,
        },
    })
});
const scheduleType = new graphql_1.GraphQLObjectType({
    name: "scheduleType",
    fields: () => ({
        date: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.date,
        },
        theaterName: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.theaterName,
        },
        movie: {
            type: MovieType,
            resolve: (obj) => cacheManager_1.default.get(cacheManager_1.default.All_MOVIES)
                .find(({ chineseTitle }) => obj.movieName === chineseTitle),
        },
        timesValues: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.timesValues,
        },
        timesStrings: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.timesStrings,
        },
        roomTypes: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.roomTypes,
        },
        theaterExtension: {
            type: TheaterType,
            resolve: (obj) => {
                return cacheManager_1.default.get(cacheManager_1.default.THEATERS).find(({ scheduleUrl }) => scheduleUrl === obj.scheduleUrl);
            }
        }
    })
});
const TheaterType = new graphql_1.GraphQLObjectType({
    name: 'Theater',
    description: 'Theater in Taiwan with google location',
    fields: () => ({
        name: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.name,
        },
        address: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.address,
        },
        url: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.url,
        },
        phone: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.phone,
        },
        region: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.region,
        },
        regionIndex: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.regionIndex,
        },
        subRegion: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.subRegion,
        },
        location: {
            type: LocationType,
            resolve: obj => obj.location
        },
        schedules: {
            type: new graphql_1.GraphQLList(scheduleType),
            resolve: obj => {
                let movieSchedules = cacheManager_1.default.get(cacheManager_1.default.MOVIES_SCHEDULES) || [];
                movieSchedules = movieSchedules.filter(({ scheduleUrl }) => {
                    return scheduleUrl === obj.scheduleUrl;
                });
                return movieSchedules;
            }
        }
    })
});
const LocationType = new graphql_1.GraphQLObjectType({
    name: 'location',
    description: 'geo location from google',
    fields: () => ({
        lat: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.lat,
        },
        lng: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.lng,
        },
        place_id: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.place_id,
        },
    })
});
exports.default = new graphql_1.GraphQLSchema({
    query: QueryType,
});
//# sourceMappingURL=schema.js.map