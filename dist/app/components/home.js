"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const movieDetailTabs_1 = require("./movieDetailTabs");
const movieList_1 = require("./movieList");
const AutoComplete_1 = require("material-ui/AutoComplete");
const Paper_1 = require("material-ui/Paper");
require("isomorphic-fetch");
const RefreshIndicator_1 = require("material-ui/RefreshIndicator");
const ALLDATA = `{
            yahooId
            posterUrl
            chineseTitle
            englishTitle
            releaseDate
            type
            runTime
            director
            actor
            launchCompany
            companyUrl
            yahooRating
            imdbID
            imdbRating
            tomatoURL            
            tomatoRating
            relatedArticles{title,push,url,date,author}
            summary
          }`;
const BRIEFDATA = `{
            yahooId
            posterUrl
            chineseTitle
            englishTitle
            releaseDate
            type
            runTime
            yahooRating
            imdbID
            imdbRating
            tomatoURL            
            tomatoRating            
            relatedArticles{title}
            briefSummary
          }`;
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            dataSource: [],
            resultMovies: [],
        };
    }
    componentWillMount() {
        if (this.props.params.id) {
            this.search([parseInt(this.props.params.id)]);
        }
        else {
            this.requestGraphQL(`{recentMovies${BRIEFDATA}}`).then((json) => {
                this.setState({ resultMovies: json.data.recentMovies.map(movie => this.classifyArticle(movie)) });
            });
        }
    }
    componentDidMount() {
        this.getDataSource();
        document.querySelector('input').focus();
    }
    getDataSource() {
        fetch('/graphql', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: "{allMoviesNames{value,text}}" }),
            credentials: 'include',
        }).then(res => res.json())
            .then((json) => {
            this.setState({ dataSource: json.data.allMoviesNames });
        });
    }
    handleUpdateInput(text) { this.setState({ searchText: text }); }
    clearSearchText() {
        this.setState({ searchText: '' });
        document.querySelector('input').focus();
    }
    onNewRequest(selectItem, index, filteredList) {
        let yahooIds = [];
        if (index === -1) {
            let searchText = selectItem.toLowerCase();
            if (!filteredList) {
                yahooIds = this.state.dataSource.filter(({ value, text }) => text.toLowerCase().indexOf(searchText) !== -1).map(({ value }) => parseInt(value)).slice(0, 6);
            }
            else {
                yahooIds = filteredList.map(({ value }) => parseInt(value.key)).slice(0, 6);
            }
        }
        else {
            yahooIds.push(parseInt(selectItem.value));
        }
        this.search(yahooIds);
    }
    requestGraphQL(query) {
        this.setState({ isLoading: true });
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
            this.setState({ isLoading: false });
            return res.json();
        });
    }
    search(yahooIds) {
        this.requestGraphQL(`
        {
          movies(yahooIds:${JSON.stringify(yahooIds)})${yahooIds.length === 1 ? ALLDATA : BRIEFDATA}
        }
    `)
            .then((json) => {
            this.setState({ resultMovies: json.data.movies.map(movie => this.classifyArticle(movie)) });
        });
    }
    classifyArticle(movie) {
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
    render() {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: `backdrop ${this.state.isLoading ? '' : 'hide'}` },
                React.createElement(RefreshIndicator_1.default, { size: 40, left: -20, top: 0, status: "loading", style: { marginLeft: '50%', marginTop: '25%', zIndex: 3 } })),
            React.createElement("div", { className: "autoCompleteWrapper" },
                React.createElement(AutoComplete_1.default, { hintText: "電影名稱(中英皆可)", dataSource: this.state.dataSource, floatingLabelText: "找電影", fullWidth: true, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this) }),
                React.createElement("button", { className: `clearButton ${this.state.searchText ? '' : 'displayNone'}`, onClick: this.clearSearchText.bind(this) }, "X")),
            this.state.resultMovies.length === 1 ?
                React.createElement(Paper_1.default, { zDepth: 2 },
                    React.createElement(movieDetailTabs_1.default, { movie: this.state.resultMovies[0] })) :
                React.createElement(movieList_1.default, { movies: this.state.resultMovies })));
    }
}
exports.default = Home;
//# sourceMappingURL=home.js.map