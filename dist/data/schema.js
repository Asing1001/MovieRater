"use strict";
var graphql_1 = require('graphql');
var cacheManager_1 = require('../data/cacheManager');
var ArticleType = new graphql_1.GraphQLObjectType({
    name: 'article',
    description: 'ptt articles',
    fields: function () { return ({
        title: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.title; },
        },
        push: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.push; },
        },
        url: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.url; },
        },
        date: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.date; },
        },
        author: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.author; },
        },
    }); }
});
var MovieType = new graphql_1.GraphQLObjectType({
    name: 'Movie',
    description: '...',
    fields: function () { return ({
        yahooId: {
            type: graphql_1.GraphQLInt,
            description: 'yahoo movie id',
            resolve: function (obj) { return obj.yahooId; },
        },
        posterUrl: {
            type: graphql_1.GraphQLString,
            description: 'poster image url',
            resolve: function (obj) { return obj.posterUrl; },
        },
        summary: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.summary; },
        },
        briefSummary: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.summary && obj.summary.length > 300 ? obj.summary.substr(0, 300) + '...' : obj.summary; },
        },
        chineseTitle: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.chineseTitle; },
        },
        englishTitle: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.englishTitle; },
        },
        releaseDate: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.releaseDate; },
        },
        type: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.type; },
        },
        runTime: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.runTime; },
        },
        director: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.director; },
        },
        actor: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.actor; },
        },
        launchCompany: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.launchCompany; },
        },
        companyUrl: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.companyUrl; },
        },
        sourceUrl: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.sourceUrl; },
        },
        goodRateArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: function (obj) { return obj.goodRateArticles; },
        },
        normalRateArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: function (obj) { return obj.normalRateArticles; },
        },
        badRateArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: function (obj) { return obj.badRateArticles; },
        },
        otherArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: function (obj) { return obj.otherArticles; },
        },
        relatedArticles: {
            type: new graphql_1.GraphQLList(ArticleType),
            resolve: function (obj) { return obj.relatedArticles; },
        },
        imdbID: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.imdbID; },
        },
        yahooRating: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.yahooRating; },
        },
        imdbRating: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.imdbRating; },
        },
        tomatoRating: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.tomatoRating; },
        },
        tomatoURL: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.tomatoURL; },
        },
        schedule: {
            type: new graphql_1.GraphQLList(scheduleType),
            resolve: function (obj) {
                return cacheManager_1.default.get(cacheManager_1.default.MOVIES_SCHEDULES)
                    .filter(function (schedule) { return schedule.yahooId == obj.yahooId; });
            },
        }
    }); }
});
var autoCompleteType = new graphql_1.GraphQLObjectType({
    name: "autoCompleteType",
    fields: function () { return ({
        value: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.value; },
        },
        text: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.text; },
        },
    }); }
});
var scheduleType = new graphql_1.GraphQLObjectType({
    name: "scheduleType",
    fields: function () { return ({
        theaterName: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.theaterName; },
        },
        yahooId: {
            type: graphql_1.GraphQLString,
            resolve: function (obj) { return obj.yahooId; },
        },
        timesValues: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: function (obj) { return obj.timesValues; },
        },
        timesStrings: {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
            resolve: function (obj) { return obj.timesStrings; },
        },
    }); }
});
var QueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    description: 'query...',
    fields: function () { return ({
        allMovies: {
            type: new graphql_1.GraphQLList(MovieType),
            description: 'every movies',
            resolve: function (root, args) { return cacheManager_1.default.get("allMovies"); }
        },
        movie: {
            type: MovieType,
            description: "[deprecated] query single movie, please use movies(yahooIds) instead",
            args: {
                yahooId: { type: graphql_1.GraphQLInt }
            },
            resolve: function (root, _a) {
                var yahooId = _a.yahooId, chineseTitle = _a.chineseTitle;
                var allMovies = cacheManager_1.default.get(cacheManager_1.default.All_MOVIES);
                return allMovies.find(function (movie) { return movie.yahooId === yahooId; });
            },
        },
        allMoviesNames: {
            type: new graphql_1.GraphQLList(autoCompleteType),
            description: 'Array of movie names, key:yahooId, value:chineseTitle or englishTitles',
            resolve: function (root, args) { return cacheManager_1.default.get(cacheManager_1.default.All_MOVIES_NAMES); }
        },
        movies: {
            type: new graphql_1.GraphQLList(MovieType),
            args: {
                yahooIds: { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) }
            },
            resolve: function (root, _a) {
                var yahooIds = _a.yahooIds;
                var allMovies = cacheManager_1.default.get("allMovies");
                var result = [];
                allMovies.forEach(function (movie) {
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
            resolve: function (root, args) { return cacheManager_1.default.get(cacheManager_1.default.RECENT_MOVIES); }
        },
    }); },
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new graphql_1.GraphQLSchema({
    query: QueryType,
});
//# sourceMappingURL=schema.js.map