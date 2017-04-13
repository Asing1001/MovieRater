"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function classifyArticle(movie) {
    if (!movie.relatedArticles)
        return movie;
    var [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], []];
    movie.relatedArticles.forEach((article) => {
        let title = article.title;
        if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
            goodRateArticles.push(article);
        }
        else if (title.indexOf('普雷') !== -1) {
            normalRateArticles.push(article);
        }
        else if (title.indexOf('負雷') !== -1) {
            badRateArticles.push(article);
        }
        else {
            otherArticles.push(article);
        }
    });
    movie.goodRateArticles = goodRateArticles;
    movie.normalRateArticles = normalRateArticles;
    movie.badRateArticles = badRateArticles;
    movie.otherArticles = otherArticles;
    return movie;
}
exports.classifyArticle = classifyArticle;
function requestGraphQL(query) {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query
        }),
        credentials: 'include',
    }).then(res => {
        return res.json();
    });
}
exports.requestGraphQL = requestGraphQL;
//# sourceMappingURL=helper.js.map