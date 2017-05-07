"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
require("isomorphic-fetch");
const react_router_1 = require("react-router");
const appAutoComplete_1 = require("./appAutoComplete");
const search_1 = require("material-ui/svg-icons/action/search");
const keyboard_backspace_1 = require("material-ui/svg-icons/hardware/keyboard-backspace");
const AppBar_1 = require("material-ui/AppBar");
const IconButton_1 = require("material-ui/IconButton");
const colors_1 = require("material-ui/styles/colors");
class AppBarSearching extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            dataSource: [],
        };
    }
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
        return (React.createElement(AppBar_1.default, { title: React.createElement("span", null, "\u4E0A\u4E00\u6B65"), titleStyle: { fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px", color: 'black' }, iconElementLeft: React.createElement(IconButton_1.default, null,
                React.createElement(keyboard_backspace_1.default, { color: "black" })), onLeftIconButtonTouchTap: this.props.onBackSpaceIconClick, iconStyleLeft: { marginTop: "4px" }, className: `appBar searching ${this.props.className}`, style: { height: "56px", backgroundColor: colors_1.grey100 }, zDepth: 2, children: React.createElement("div", { className: "searchArea" },
                React.createElement("span", { className: "hidden-xs", style: { paddingRight: "1em", } },
                    React.createElement(search_1.default, { style: { height: "36px", color: 'inherit' } })),
                React.createElement(appAutoComplete_1.default, { dataSource: this.state.dataSource, onNewRequest: this.onNewRequest.bind(this) })) }));
    }
}
exports.default = AppBarSearching;
//# sourceMappingURL=appBarSearching.js.map