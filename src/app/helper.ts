import Movie from '../models/movie';

export function classifyArticle(movie: Movie) {
    if (!movie.relatedArticles) return movie;
    var [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], []];
    movie.relatedArticles.forEach((article) => {
        let title = article.title;
        if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
            goodRateArticles.push(article);
        } else if (title.indexOf('普雷') !== -1) {
            normalRateArticles.push(article)
        } else if (title.indexOf('負雷') !== -1) {
            badRateArticles.push(article)
        } else {
            otherArticles.push(article);
        }
    });
    movie.goodRateArticles = goodRateArticles;
    movie.normalRateArticles = normalRateArticles;
    movie.badRateArticles = badRateArticles;
    movie.otherArticles = otherArticles;
    return movie;
}

export function requestGraphQL(query: string) {
    return fetch(`/graphql?query=${query.replace(/\s+/g,"")}`).then(res => {
        return res.json()
    })
}