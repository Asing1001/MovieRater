"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const BottomNavigation_1 = require("material-ui/BottomNavigation");
const Paper_1 = require("material-ui/Paper");
const sort_1 = require("material-ui/svg-icons/content/sort");
const findResult_1 = require("./findResult");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const nearbyIcon = React.createElement(sort_1.default, null);
const BRIEFDATA = `{
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
            tomatoURL,            
            tomatoRating,           
            relatedArticles{title},
            briefSummary
          }`;
var SortType;
(function (SortType) {
    SortType[SortType["imdb"] = 0] = "imdb";
    SortType[SortType["yahoo"] = 1] = "yahoo";
    SortType[SortType["tomato"] = 2] = "tomato";
    SortType[SortType["ptt"] = 3] = "ptt";
})(SortType || (SortType = {}));
class MovieList extends React.Component {
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
                case SortType.tomato:
                    sortFunction = this.getStandardSortFunction('tomatoRating');
                    break;
                case SortType.yahoo:
                    sortFunction = this.getStandardSortFunction('yahooRating');
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
    getData(ids) {
        this.setState({ isLoading: true });
        if (ids) {
            const yahooIds = JSON.stringify(ids.split(',').map(id => parseInt(id)));
            helper_1.requestGraphQL(`
        {
          movies(yahooIds:${yahooIds})${BRIEFDATA}
        }
        `)
                .then((json) => {
                this.setState({ movies: json.data.movies.map(movie => helper_1.classifyArticle(movie)), isLoading: false });
            });
        }
        else {
            helper_1.requestGraphQL(`{recentMovies${BRIEFDATA}}`).then((json) => {
                this.setState({ movies: json.data.recentMovies.map(movie => helper_1.classifyArticle(movie)), isLoading: false });
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.params.ids);
    }
    componentWillMount() {
        this.getData(this.props.params.ids);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading }),
            React.createElement(Paper_1.default, { zDepth: 2, style: { marginBottom: '.5em' } },
                React.createElement(BottomNavigation_1.BottomNavigation, { selectedIndex: this.state.selectedIndex },
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "IMDB", icon: nearbyIcon, onTouchTap: () => this.select(SortType.imdb) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "YAHOO", icon: nearbyIcon, onTouchTap: () => this.select(SortType.yahoo) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "TOMATO", icon: nearbyIcon, onTouchTap: () => this.select(SortType.tomato), className: "hide" }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "PTT", icon: nearbyIcon, onTouchTap: () => this.select(SortType.ptt) }))),
            this.state.movies.sort(this.state.sortFunction).map((movie) => (React.createElement(findResult_1.default, { key: movie.yahooId, movie: movie })))));
    }
}
exports.default = MovieList;
//# sourceMappingURL=movieList.js.map