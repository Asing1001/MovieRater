import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
} from 'graphql';
import cacheManager from '../data/cacheManager';
import Movie from '../models/movie';
import Schedule from '../models/schedule';

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'query...',
    fields: () => ({
        allMovies: {
            type: new GraphQLList(MovieType),
            description: 'every movies',
            resolve: (root, args) => cacheManager.get("allMovies")
        },
        allMoviesNames: {
            type: new GraphQLList(autoCompleteType),
            description: 'Array of movie names, key:yahooId, value:chineseTitle or englishTitles',
            resolve: (root, args) => cacheManager.get(cacheManager.All_MOVIES_NAMES)
        },
        movies: {
            type: new GraphQLList(MovieType),
            args: {
                yahooIds: { type: new GraphQLList(GraphQLInt) }
            },
            resolve: async (root, { yahooIds }) => {
                let allMovies: Array<Movie> = cacheManager.get("allMovies");
                let result = [];
                allMovies.forEach((movie) => {
                    if (yahooIds.indexOf(movie.yahooId) !== -1) {
                        result.push(movie);
                    }
                })
                return result;
            },
        },
        recentMovies: {
            type: new GraphQLList(MovieType),
            description: 'recent movies',
            resolve: (root, args) => cacheManager.get(cacheManager.RECENT_MOVIES)
        },
        theaters: {
            type: new GraphQLList(TheaterType),
            resolve: (root, args) => cacheManager.get(cacheManager.THEATERS)
        },
    }),
});

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
        summary: {
            type: GraphQLString,
            resolve: obj => obj.summary,
        },
        briefSummary: {
            type: GraphQLString,
            resolve: obj => obj.summary && obj.summary.length > 300 ? obj.summary.substr(0, 300) + '...' : obj.summary,
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
        goodRateArticles: {
            type: new GraphQLList(ArticleType),
            resolve: obj => obj.goodRateArticles,
        },
        normalRateArticles: {
            type: new GraphQLList(ArticleType),
            resolve: obj => obj.normalRateArticles,
        },
        badRateArticles: {
            type: new GraphQLList(ArticleType),
            resolve: obj => obj.badRateArticles,
        },
        otherArticles: {
            type: new GraphQLList(ArticleType),
            resolve: obj => obj.otherArticles,
        },
        relatedArticles: {
            type: new GraphQLList(ArticleType),
            resolve: obj => obj.relatedArticles,
        },
        imdbID: {
            type: GraphQLString,
            resolve: obj => obj.imdbID,
        },
        yahooRating: {
            type: GraphQLString,
            resolve: obj => obj.yahooRating,
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
        schedules: {
            type: new GraphQLList(scheduleType),
            resolve: async (obj) => {
                const moviesSchedules = cacheManager.get(cacheManager.MOVIES_SCHEDULES);
                return moviesSchedules.filter((schedule: Schedule) => schedule.yahooId == obj.yahooId);
            },
        }
    })
});

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

const autoCompleteType = new GraphQLObjectType({
    name: "autoCompleteType",
    fields: () => ({
        value: {
            type: GraphQLString,
            resolve: obj => obj.value,
        },
        text: {
            type: GraphQLString,
            resolve: obj => obj.text,
        },
    })
})

const scheduleType = new GraphQLObjectType({
    name: "scheduleType",
    fields: () => ({
        theaterName: {
            type: GraphQLString,
            resolve: obj => obj.theaterName,
        },
        yahooId: {
            type: GraphQLString,
            resolve: obj => obj.yahooId,
        },
        timesValues: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.timesValues,
        },
        timesStrings: {
            type: new GraphQLList(GraphQLString),
            resolve: obj => obj.timesStrings,
        },
        theaterExtension: {
            type: TheaterType,
            resolve: obj => {
                return cacheManager.get(cacheManager.THEATERS).find(({ name }) => name === obj.theaterName)
            }
        }
    })
})

const TheaterType = new GraphQLObjectType({
    name: 'Theater',
    description: 'Theater in Taiwan with google location',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: obj => obj.name,
        },
        address: {
            type: GraphQLString,
            resolve: obj => obj.address,
        },
        url: {
            type: GraphQLString,
            resolve: obj => obj.url,
        },
        phone: {
            type: GraphQLString,
            resolve: obj => obj.phone,
        },
        region: {
            type: GraphQLString,
            resolve: obj => obj.region,
        },
        location:{
            type: LocationType,
            resolve: obj => obj.location
        }
    })
})


const LocationType = new GraphQLObjectType({
    name: 'location',
    description: 'geo location from google',
    fields: () => ({
        lat: {
            type: GraphQLString,
            resolve: obj => obj.lat,
        },
        lng: {
            type: GraphQLString,
            resolve: obj => obj.lng,
        },
        place_id: {
            type: GraphQLString,
            resolve: obj => obj.place_id,
        },
    })
})

export default new GraphQLSchema({
    query: QueryType,
});