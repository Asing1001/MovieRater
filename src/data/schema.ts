import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import { db } from './db';

const ArticleType = new GraphQLObjectType({
    name: 'article',
    description: 'ptt articles',
    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: obj => obj.title,
        },
        push: {
            type: GraphQLString,
            resolve: obj => obj.push,
        },
        url: {
            type: GraphQLString,
            resolve: obj => obj.url,
        },
        date: {
            type: GraphQLString,
            resolve: obj => obj.date,
        },
        author: {
            type: GraphQLString,
            resolve: obj => obj.author,
        },
    })
})

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: '...',
    fields: () => ({
        yahooId: {
            type: GraphQLInt,
            description: 'yahoo movie id',
            resolve: obj => obj.yahooId,
        },
        posterUrl: {
            type: GraphQLString,
            description: 'poster image url',
            resolve: obj => obj.posterUrl,
        },
        chineseTitle: {
            type: GraphQLString,
            resolve: obj => obj.chineseTitle,
        },
        englishTitle: {
            type: GraphQLString,
            resolve: obj => obj.englishTitle,
        },
        releaseDate: {
            type: GraphQLString,
            resolve: obj => obj.releaseDate,
        },
        type: {
            type: GraphQLString,
            resolve: obj => obj.type,
        },
        runTime: {
            type: GraphQLString,
            resolve: obj => obj.runTime,
        },
        director: {
            type: GraphQLString,
            resolve: obj => obj.director,
        },
        actor: {
            type: GraphQLString,
            resolve: obj => obj.actor,
        },
        launchCompany: {
            type: GraphQLString,
            resolve: obj => obj.launchCompany,
        },
        companyUrl: {
            type: GraphQLString,
            resolve: obj => obj.companyUrl,
        },
        sourceUrl: {
            type: GraphQLString,
            resolve: obj => obj.sourceUrl,
        },
        goodRateCount: {
            type: GraphQLString,
            resolve: obj => obj.goodRateCount,
        },
        normalRateCount: {
            type: GraphQLString,
            resolve: obj => obj.normalRateCount,
        },
        badRateCount: {
            type: GraphQLString,
            resolve: obj => obj.badRateCount,
        },
        relateArticles: {
            type: new GraphQLList(ArticleType),
            resolve: obj => obj.relateArticles,
        },
        imdbID: {
            type: GraphQLString,
            resolve: obj => obj.imdbID,
        },
        rating: {
            type: GraphQLString,
            resolve: obj => obj.rating,
        },
        imdbRating: {
            type: GraphQLString,
            resolve: obj => obj.imdbRating,
        },
        tomatoRating: {
            type: GraphQLString,
            resolve: obj => obj.tomatoRating,
        },
        tomatoURL: {
            type: GraphQLString,
            resolve: obj => obj.tomatoURL,
        },
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'query...',
    fields: () => ({
        allMovies: {
            type: new GraphQLList(MovieType),
            description: 'every movies',
            resolve: (root, args) => db.getCollection("yahooMovies")
        },
        movie: {
            type: MovieType,
            args: {
                yahooId: { type: GraphQLInt },
                chineseTitle: { type: GraphQLString }
            },
            resolve: (root, {yahooId, chineseTitle}) => {
                let query: any = {}
                if (yahooId) query.yahooId = yahooId;
                if (chineseTitle) query.chineseTitle = chineseTitle;
                return db.getDocument(query, "yahooMovies")
            },
        },
    }),
});

export default new GraphQLSchema({
    query: QueryType,
});