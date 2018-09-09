"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
const injectTapEventPlugin = require("react-tap-event-plugin");
const react_router_dom_1 = require("react-router-dom");
const appBarSearching_1 = require("./appBarSearching");
const appBarNormal_1 = require("./appBarNormal");
const movieDetailTabs_1 = require("./movieDetailTabs");
const movieList_1 = require("./movieList");
const movieNotFound_1 = require("./movieNotFound");
const theaterList_1 = require("./theaterList");
const theaterDetail_1 = require("./theaterDetail");
const pageNotFound_1 = require("./pageNotFound");
const sorting_1 = require("../sorting");
injectTapEventPlugin();
class App extends React.Component {
    constructor(props) {
        super(props);
        this.muiTheme = getMuiTheme_1.default({
            userAgent: navigator.userAgent
        });
        this.handleSearchToggle = () => {
            this.setState({ searching: !this.state.searching });
            setTimeout(() => document.querySelector('input').focus(), 100);
        };
        this.state = {
            searching: false,
            sortFunction: sorting_1.getSortFunction(sorting_1.SortType.releaseDate)
        };
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, { muiTheme: this.muiTheme },
            React.createElement("div", null,
                React.createElement(appBarNormal_1.default, { className: this.state.searching && "vanish", onSearchIconClick: this.handleSearchToggle.bind(this), switchSorting: (sortType) => this.setState({ sortFunction: sorting_1.getSortFunction(sortType) }) }),
                React.createElement(appBarSearching_1.default, { className: !this.state.searching && "vanish", onBackSpaceIconClick: this.handleSearchToggle.bind(this) }),
                React.createElement("div", { className: "container", style: { marginTop: '.5em' } },
                    React.createElement(react_router_dom_1.Switch, null,
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/", render: (props) => {
                                document.title = `現正上映 - Movie Rater`;
                                return React.createElement(movieList_1.default, Object.assign({}, props, { sortFunction: this.state.sortFunction }));
                            } }),
                        React.createElement(react_router_dom_1.Route, { path: "/upcoming", render: (props) => {
                                document.title = `即將上映 - Movie Rater`;
                                return React.createElement(movieList_1.default, Object.assign({}, props, { sortFunction: this.state.sortFunction }));
                            } }),
                        React.createElement(react_router_dom_1.Route, { path: "/movie/:id", component: movieDetailTabs_1.default }),
                        React.createElement(react_router_dom_1.Route, { path: "/movies/:ids", render: (props) => React.createElement(movieList_1.default, Object.assign({}, props, { sortFunction: this.state.sortFunction })) }),
                        React.createElement(react_router_dom_1.Route, { path: "/movienotfound/:query", component: movieNotFound_1.default }),
                        React.createElement(react_router_dom_1.Route, { path: "/theaters", component: theaterList_1.default }),
                        React.createElement(react_router_dom_1.Route, { path: "/theater/:name", render: (props) => React.createElement(theaterDetail_1.default, Object.assign({}, props, { sortFunction: this.state.sortFunction })) }),
                        React.createElement(react_router_dom_1.Route, { component: pageNotFound_1.default }))))));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map