"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const findResult_1 = require("./findResult");
const BottomNavigation_1 = require("material-ui/BottomNavigation");
const Paper_1 = require("material-ui/Paper");
const sort_1 = require("material-ui/svg-icons/content/sort");
const FontIcon_1 = require("material-ui/FontIcon");
const recentsIcon = React.createElement(FontIcon_1.default, { className: "material-icons" }, "restore");
const favoritesIcon = React.createElement(FontIcon_1.default, { className: "material-icons" }, "favorite");
const nearbyIcon = React.createElement(sort_1.default, null);
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
                    sortFunction = this.GetStandardSortFunction('imdbRating');
                    break;
                case SortType.ptt:
                    sortFunction = (a, b) => this.GetPttRating(b) - this.GetPttRating(a);
                    break;
                case SortType.tomato:
                    sortFunction = this.GetStandardSortFunction('tomatoRating');
                    break;
                case SortType.yahoo:
                    sortFunction = this.GetStandardSortFunction('yahooRating');
                    break;
            }
            this.setState({ selectedIndex: index, sortFunction: sortFunction });
        };
        this.GetStandardSortFunction = (propertyName) => {
            return function (a, b) {
                let aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
                let bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
                return bValue - aValue;
            };
        };
        this.GetPttRating = (movie) => {
            return movie.goodRateArticles.length - movie.badRateArticles.length;
        };
        this.state = {
            selectedIndex: SortType.imdb,
            sortFunction: this.GetStandardSortFunction('imdbRating')
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Paper_1.default, { zDepth: 2, style: { marginBottom: '.5em' } },
                React.createElement(BottomNavigation_1.BottomNavigation, { selectedIndex: this.state.selectedIndex },
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "IMDB", icon: nearbyIcon, onTouchTap: () => this.select(SortType.imdb) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "YAHOO", icon: nearbyIcon, onTouchTap: () => this.select(SortType.yahoo) }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "TOMATO", icon: nearbyIcon, onTouchTap: () => this.select(SortType.tomato), className: "hide" }),
                    React.createElement(BottomNavigation_1.BottomNavigationItem, { label: "PTT", icon: nearbyIcon, onTouchTap: () => this.select(SortType.ptt) }))),
            this.props.movies.sort(this.state.sortFunction).map((movie) => (React.createElement(findResult_1.default, { key: movie.yahooId, movie: movie })))));
    }
}
exports.default = MovieList;
//# sourceMappingURL=movieList.js.map