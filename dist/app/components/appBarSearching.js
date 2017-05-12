"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AutoComplete_1 = require("material-ui/AutoComplete");
require("isomorphic-fetch");
const react_router_1 = require("react-router");
const search_1 = require("material-ui/svg-icons/action/search");
const clear_1 = require("material-ui/svg-icons/content/clear");
const keyboard_backspace_1 = require("material-ui/svg-icons/hardware/keyboard-backspace");
const IconButton_1 = require("material-ui/IconButton");
const Paper_1 = require("material-ui/Paper");
class AppBarSearching extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            dataSource: []
        };
    }
    clearSearchText() {
        this.setState({ searchText: '' });
        setTimeout(() => document.querySelector('input').focus(), 100);
    }
    handleUpdateInput(text) { this.setState({ searchText: text }); }
    componentDidMount() {
        this.getDataSource();
    }
    getDataSource() {
        fetch('/graphql?query={allMoviesNames{value,text}}')
            .then(res => res.json())
            .then((json) => {
            this.setState({ dataSource: json.data.allMoviesNames });
        });
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
        if (yahooIds.length === 1) {
            react_router_1.browserHistory.push(`/movie/${yahooIds}`);
        }
        else {
            react_router_1.browserHistory.push(`/movielist/${yahooIds}`);
        }
    }
    render() {
        return (React.createElement(Paper_1.default, { zDepth: 2, className: `appBar searching ${this.props.className}` },
            React.createElement(IconButton_1.default, { className: "leftBtn", onTouchTap: this.props.onBackSpaceIconClick },
                React.createElement(keyboard_backspace_1.default, null)),
            React.createElement("span", { className: "hidden-xs barTitle" }, "\u4E0A\u4E00\u6B65"),
            React.createElement("span", { className: "searchArea" },
                React.createElement(search_1.default, { className: "hidden-xs searchIcon" }),
                React.createElement(AutoComplete_1.default, { hintText: React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)"), dataSource: this.state.dataSource, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 8, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this), menuStyle: { minWidth: "500px" }, fullWidth: true })),
            React.createElement(IconButton_1.default, { onTouchTap: this.clearSearchText.bind(this), className: "visible-xs rightBtn" },
                React.createElement(clear_1.default, null))));
    }
}
exports.default = AppBarSearching;
//# sourceMappingURL=appBarSearching.js.map