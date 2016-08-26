import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import {db} from './db';


const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: '...',
    fields: () => ({
        yahooId: {
            type: GraphQLInt,
            description: 'yahoo movie id',
            resolve: obj => obj.yahooId,
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
                yahooId: { type: new GraphQLNonNull(GraphQLInt) }                
            },
            resolve: (root, args:any) => db.getDocument({yahooId:args.yahooId},"yahooMovies"),
        },
    }),
});

export default new GraphQLSchema({
    query: QueryType,
});