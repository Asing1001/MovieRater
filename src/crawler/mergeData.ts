import YahooMovie from '../models/yahooMovie';

export function mergeData(yahooMovies: Array<YahooMovie>, pttPages) {
    //merge [[1,2],[3,4]] to [1,2,3,4]
    let allArticles = [].concat(...pttPages.map(({articles}) => articles));
    let mergedMovies = yahooMovies.map(mergeByChineseTitle);
    return mergedMovies;

    function mergeByChineseTitle(movie) {        
        let chineseTitle = movie.chineseTitle;
        movie.relatedArticles = allArticles.filter(({title}) => title.indexOf(chineseTitle) !== -1);
        return movie;
    }
}

