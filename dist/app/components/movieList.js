"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var findResult_1 = require('./findResult');
var BottomNavigation_1 = require('material-ui/BottomNavigation');
var Paper_1 = require('material-ui/Paper');
var sort_1 = require('material-ui/svg-icons/content/sort');
var FontIcon_1 = require('material-ui/FontIcon');
var recentsIcon = React.createElement(FontIcon_1.default, {className: "material-icons"}, "restore");
var favoritesIcon = React.createElement(FontIcon_1.default, {className: "material-icons"}, "favorite");
var nearbyIcon = React.createElement(sort_1.default, null);
var SortType;
(function (SortType) {
    SortType[SortType["imdb"] = 0] = "imdb";
    SortType[SortType["yahoo"] = 1] = "yahoo";
    SortType[SortType["tomato"] = 2] = "tomato";
    SortType[SortType["ptt"] = 3] = "ptt";
})(SortType || (SortType = {}));
var MovieList = (function (_super) {
    __extends(MovieList, _super);
    function MovieList(props) {
        var _this = this;
        _super.call(this, props);
        this.select = function (index) {
            if (_this.state.selectedIndex === index) {
                return;
            }
            var sortFunction;
            switch (index) {
                case SortType.imdb:
                    sortFunction = _this.GetStandardSortFunction('imdbRating');
                    break;
                case SortType.ptt:
                    sortFunction = function (a, b) { return _this.GetPttRating(b) - _this.GetPttRating(a); };
                    break;
                case SortType.tomato:
                    sortFunction = _this.GetStandardSortFunction('tomatoRating');
                    break;
                case SortType.yahoo:
                    sortFunction = _this.GetStandardSortFunction('yahooRating');
                    break;
            }
            _this.setState({ selectedIndex: index, sortFunction: sortFunction });
        };
        this.GetStandardSortFunction = function (propertyName) {
            return function (a, b) {
                var aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
                var bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
                return bValue - aValue;
            };
        };
        this.GetPttRating = function (movie) {
            return movie.goodRateArticles.length - movie.badRateArticles.length;
        };
        this.state = {
            selectedIndex: SortType.imdb,
            sortFunction: this.GetStandardSortFunction('imdbRating')
        };
    }
    MovieList.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null, 
            React.createElement(Paper_1.default, {zDepth: 2, style: { marginBottom: '.5em' }}, 
                React.createElement(BottomNavigation_1.BottomNavigation, {selectedIndex: this.state.selectedIndex}, 
                    React.createElement(BottomNavigation_1.BottomNavigationItem, {label: "IMDB", icon: nearbyIcon, onTouchTap: function () { return _this.select(SortType.imdb); }}), 
                    React.createElement(BottomNavigation_1.BottomNavigationItem, {label: "YAHOO", icon: nearbyIcon, onTouchTap: function () { return _this.select(SortType.yahoo); }}), 
                    React.createElement(BottomNavigation_1.BottomNavigationItem, {label: "TOMATO", icon: nearbyIcon, onTouchTap: function () { return _this.select(SortType.tomato); }}), 
                    React.createElement(BottomNavigation_1.BottomNavigationItem, {label: "PTT", icon: nearbyIcon, onTouchTap: function () { return _this.select(SortType.ptt); }}))
            ), 
            this.props.movies.sort(this.state.sortFunction).map(function (movie) { return (React.createElement(findResult_1.default, {key: movie.yahooId, movie: movie})); })));
    };
    return MovieList;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MovieList;
//# sourceMappingURL=movieList.js.map