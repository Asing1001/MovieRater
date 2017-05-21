"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const moment = require("moment");
const BottomNavigation_1 = require("material-ui/BottomNavigation");
const Paper_1 = require("material-ui/Paper");
const sort_1 = require("material-ui/svg-icons/content/sort");
const findResult_1 = require("./findResult");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const react_apollo_1 = require("react-apollo");
const nearbyIcon = React.createElement(sort_1.default, null);
const recentMoviesQuery = react_apollo_1.gql `
         query MovieListing($yahooIds:[Int]){
           movies(yahooIds:$yahooIds) {
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            type,
            runTime,
            yahooRating,
            imdbID,
            imdbRating,
            relatedArticles{title},
            briefSummary
            }
          }`;
var SortType;
(function (SortType) {
    SortType[SortType["imdb"] = 0] = "imdb";
    SortType[SortType["yahoo"] = 1] = "yahoo";
    SortType[SortType["ptt"] = 2] = "ptt";
    SortType[SortType["releaseDate"] = 3] = "releaseDate";
})(SortType || (SortType = {}));
let MovieList = class MovieList extends React.Component {
    constructor(props) {
        super(props);
        this.select = (index) => {
            if (this.state.selectedIndex === index) {
                return;
            }
            var sortFunction;
            switch (index) {
                case SortType.imdb:
                    sortFunction = this.getStandardSortFunction('imdbRating');
                    break;
                case SortType.ptt:
                    sortFunction = (a, b) => this.getPttRating(b) - this.getPttRating(a);
                    break;
                case SortType.yahoo:
                    sortFunction = this.getStandardSortFunction('yahooRating');
                    break;
                case SortType.releaseDate:
                    sortFunction = ({ releaseDate: releaseDateA }, { releaseDate: releaseDateB }) => moment(releaseDateB).diff(releaseDateA);
                    break;
            }
            this.setState({ selectedIndex: index, sortFunction: sortFunction });
        };
        this.getStandardSortFunction = (propertyName) => {
            return function (a, b) {
                let aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
                let bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
                return bValue - aValue;
            };
        };
        this.getPttRating = (movie) => {
            return movie.goodRateArticles.length - movie.badRateArticles.length;
        };
        this.state = {
            selectedIndex: SortType.imdb,
            sortFunction: this.getStandardSortFunction('imdbRating'),
            movies: [],
            isLoading: true
        };
    }
    render() {
        if (this.props.data.loading) {
            return React.createElement(loadingIcon_1.default, { isLoading: this.props.data.loading });
        }
        return (React.createElement("div", null,
            React.createElement(Paper_1.default, { zDepth: 2, style: { marginBottom: '.5em' } },
                React.createElement(BottomNavigation_1.BottomNavigation, { selectedIndex: this.state.selectedIndex },
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "IMDB", icon: nearbyIcon, onTouchTap: () => this.select(SortType.imdb) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "YAHOO", icon: nearbyIcon, onTouchTap: () => this.select(SortType.yahoo) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "PTT", icon: nearbyIcon, onTouchTap: () => this.select(SortType.ptt) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "上映日", icon: nearbyIcon, onTouchTap: () => this.select(SortType.releaseDate) }))),
            this.props.data.movies.map(movie => helper_1.classifyArticle(movie)).sort(this.state.sortFunction).map((movie, index) => (React.createElement(Paper_1.default, { zDepth: 2, className: "row no-margin", style: { marginBottom: '.5em' }, key: index },
                React.createElement(findResult_1.default, { key: movie.yahooId, movie: movie }))))));
    }
};
MovieList = __decorate([
    react_apollo_1.graphql(recentMoviesQuery, {
        options: ({ match }) => {
            return match.params.ids ? {
                variables: {
                    yahooIds: match.params.ids.split(',').map(id => parseInt(id))
                }
            } : {};
        },
    }),
    __metadata("design:paramtypes", [Object])
], MovieList);
exports.default = MovieList;
//# sourceMappingURL=movieList.js.map