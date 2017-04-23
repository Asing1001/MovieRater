"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const cacheManager_1 = require("../data/cacheManager");
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
            resolve: obj => obj.summary && obj.summary.length > 300 ? obj.summary.substr(0, 300) + '...' : obj.summary,
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
        type: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.type,
        },
        runTime: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.runTime,
        },
        director: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.director,
        },
        actor: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.actor,
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
            resolve: obj => {
                return cacheManager_1.default.get(cacheManager_1.default.MOVIES_SCHEDULES)
                    .filter((schedule) => schedule.yahooId == obj.yahooId);
            },
        }
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
        theaterName: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.theaterName,
        },
        yahooId: {
            type: graphql_1.GraphQLString,
            resolve: obj => obj.yahooId,
        },
        timesValues: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.timesValues,
        },
        timesStrings: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: obj => obj.timesStrings,
        },
    })
});
const QueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    description: 'query...',
    fields: () => ({
        allMovies: {
            type: new graphql_1.GraphQLList(MovieType),
            description: 'every movies',
            resolve: (root, args) => cacheManager_1.default.get("allMovies")
        },
        movie: {
            type: MovieType,
            description: "[deprecated] query single movie, please use movies(yahooIds) instead",
            args: {
                yahooId: { type: graphql_1.GraphQLInt }
            },
            resolve: (root, { yahooId, chineseTitle }) => {
                let allMovies = cacheManager_1.default.get(cacheManager_1.default.All_MOVIES);
                return allMovies.find((movie) => { return movie.yahooId === yahooId; });
            },
        },
        allMoviesNames: {
            type: new graphql_1.GraphQLList(autoCompleteType),
            description: 'Array of movie names, key:yahooId, value:chineseTitle or englishTitles',
            resolve: (root, args) => cacheManager_1.default.get(cacheManager_1.default.All_MOVIES_NAMES)
        },
        movies: {
            type: new graphql_1.GraphQLList(MovieType),
            args: {
                yahooIds: { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) }
            },
            resolve: (root, { yahooIds }) => {
                let allMovies = cacheManager_1.default.get("allMovies");
                let result = [];
                allMovies.forEach((movie) => {
                    if (yahooIds.indexOf(movie.yahooId) !== -1) {
                        result.push(movie);
                    }
                });
                return result;
            },
        },
        recentMovies: {
            type: new graphql_1.GraphQLList(MovieType),
            description: 'recent movies',
            resolve: (root, args) => cacheManager_1.default.get(cacheManager_1.default.RECENT_MOVIES)
        },
    }),
});
exports.default = new graphql_1.GraphQLSchema({
    query: QueryType,
});
//# sourceMappingURL=schema.js.map