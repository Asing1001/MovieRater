import * as memoryCache from 'memory-cache';
import {db} from "../data/db";


export default class cacheManager{
    static init(){
        return db.getCollection("yahooMovies").then((data)=>{
            console.log("[cacheManager] db.getCollection('yahooMovies') >> success");
            return memoryCache.put("allMovies",data);
        })
    }

    static get(key){
        let data = memoryCache.get(key);
        return data;
    }
}