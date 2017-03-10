"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var movieDetailTabs_1 = require("./movieDetailTabs");
var movieList_1 = require("./movieList");
var AutoComplete_1 = require("material-ui/AutoComplete");
var Paper_1 = require("material-ui/Paper");
require("isomorphic-fetch");
var ALLDATA = "{\n            yahooId\n            posterUrl\n            chineseTitle\n            englishTitle\n            releaseDate\n            type\n            runTime\n            director\n            actor\n            launchCompany\n            companyUrl\n            sourceUrl                       \n            yahooRating\n            imdbID\n            imdbRating\n            tomatoURL            \n            tomatoRating\n            relatedArticles{title,push,url,date,author}\n            summary\n          }";
var Home = (function (_super) {
    __extends(Home, _super);
    function Home(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            searchText: '',
            dataSource: [],
            resultMovies: []
        };
        return _this;
    }
    Home.prototype.componentWillMount = function () {
        var _this = this;
        if (this.props.params.id) {
            this.search([parseInt(this.props.params.id)]);
        }
        else {
            this.requestGraphQL("{recentMovies" + ALLDATA + "}").then(function (json) {
                _this.setState({ resultMovies: json.data.recentMovies.map(function (movie) { return _this.classifyArticle(movie); }) });
            });
        }
    };
    Home.prototype.componentDidMount = function () {
        this.getDataSource();
        document.querySelector('input').focus();
    };
    Home.prototype.getDataSource = function () {
        var _this = this;
        fetch('/graphql', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: "{allMoviesNames{value,text}}" }),
            credentials: 'include',
        }).then(function (res) { return res.json(); })
            .then(function (json) {
            _this.setState({ dataSource: json.data.allMoviesNames });
        });
    };
    Home.prototype.handleUpdateInput = function (text) { this.setState({ searchText: text }); };
    Home.prototype.clearSearchText = function () {
        this.setState({ searchText: '' });
        document.querySelector('input').focus();
    };
    Home.prototype.onNewRequest = function (selectItem, index, filteredList) {
        var yahooIds = [];
        if (index === -1) {
            var searchText_1 = selectItem.toLowerCase();
            if (!filteredList) {
                yahooIds = this.state.dataSource.filter(function (_a) {
                    var value = _a.value, text = _a.text;
                    return text.toLowerCase().indexOf(searchText_1) !== -1;
                }).map(function (_a) {
                    var value = _a.value;
                    return parseInt(value);
                }).slice(0, 6);
            }
            else {
                yahooIds = filteredList.map(function (_a) {
                    var value = _a.value;
                    return parseInt(value.key);
                }).slice(0, 6);
            }
        }
        else {
            yahooIds.push(parseInt(selectItem.value));
        }
        this.search(yahooIds);
    };
    Home.prototype.requestGraphQL = function (query) {
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
        }).then(function (res) { return res.json(); });
    };
    Home.prototype.search = function (yahooIds) {
        var _this = this;
        this.requestGraphQL("\n        {\n          movies(yahooIds:" + JSON.stringify(yahooIds) + ")" + ALLDATA + "\n        }\n    ")
            .then(function (json) {
            _this.setState({ resultMovies: json.data.movies.map(function (movie) { return _this.classifyArticle(movie); }) });
        });
    };
    Home.prototype.classifyArticle = function (movie) {
        if (!movie.relatedArticles)
            return movie;
        var _a = [[], [], [], []], goodRateArticles = _a[0], normalRateArticles = _a[1], badRateArticles = _a[2], otherArticles = _a[3];
        movie.relatedArticles.forEach(function (article) {
            var title = article.title;
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
    };
    Home.prototype.showDetail = function (movie) {
        this.setState({ resultMovies: [movie] });
    };
    Home.prototype.render = function () {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "autoCompleteWrapper" },
                React.createElement(AutoComplete_1.default, { hintText: "電影名稱(中英皆可)", dataSource: this.state.dataSource, floatingLabelText: "找電影", fullWidth: true, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this) }),
                React.createElement("button", { className: "clearButton " + (this.state.searchText ? '' : 'displayNone'), onClick: this.clearSearchText.bind(this) }, "X")),
            this.state.resultMovies.length === 1 ?
                React.createElement(Paper_1.default, { zDepth: 2 },
                    React.createElement(movieDetailTabs_1.default, { movie: this.state.resultMovies[0] })) :
                React.createElement(movieList_1.default, { movies: this.state.resultMovies, showDetail: this.showDetail.bind(this) })));
    };
    return Home;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
//# sourceMappingURL=home.js.map