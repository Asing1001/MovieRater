import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";

export default class cacheManager {
    static init() {
        var allMoviesPromise = db.getCollection("yahooMovies", { sort: { yahooId: -1 } }).then((data) => {
            console.log("[cacheManager] db.getCollection('yahooMovies') >> success");
            return memoryCache.put("allMovies", data);
        })

        var allArticlesPromise = db.getCollection("pttPages", { sort: { yahooId: -1 } }).then((pttPages) => {            
            console.log("[cacheManager] db.getCollection('pttPages') >> success");
            let allArticles = [].concat(...pttPages.map(({articles}) => articles));
            return memoryCache.put("allArticles", allArticles);
        })

        return Q.all([allMoviesPromise,allArticlesPromise]);
    }

    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }
}