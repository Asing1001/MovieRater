"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AutoComplete_1 = require("material-ui/AutoComplete");
require("isomorphic-fetch");
const react_router_1 = require("react-router");
const Drawer_1 = require("material-ui/Drawer");
const search_1 = require("material-ui/svg-icons/action/search");
const keyboard_backspace_1 = require("material-ui/svg-icons/hardware/keyboard-backspace");
const movie_1 = require("material-ui/svg-icons/av/movie");
const AppBar_1 = require("material-ui/AppBar");
const List_1 = require("material-ui/List");
const IconButton_1 = require("material-ui/IconButton");
const colors_1 = require("material-ui/styles/colors");
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggle = () => this.setState({ open: !this.state.open });
        this.handleClose = () => { this.setState({ open: false }); react_router_1.browserHistory.push(`/`); };
        this.handleSearchToggle = () => { this.setState({ showSearchingAppBar: !this.state.showSearchingAppBar }); };
        this.state = {
            searchText: '',
            dataSource: [],
            showSearchingAppBar: false,
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
        if (yahooIds.length === 1) {
            react_router_1.browserHistory.push(`/movie/${yahooIds}`);
        }
        else {
            react_router_1.browserHistory.push(`/movielist/${yahooIds}`);
        }
    }
    render() {
        return (React.createElement("div", null,
            this.state.showSearchingAppBar ?
                React.createElement(AppBar_1.default, { title: React.createElement("span", null, "\u4E0A\u4E00\u6B65"), titleStyle: { fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px", color: 'black' }, iconElementLeft: React.createElement(IconButton_1.default, null,
                        React.createElement(keyboard_backspace_1.default, { color: "black" })), onLeftIconButtonTouchTap: this.handleSearchToggle, iconStyleLeft: { marginTop: "4px" }, className: "appBar searching", style: { height: "56px", backgroundColor: colors_1.grey100 }, zDepth: 2, children: React.createElement("div", { className: "searchArea" },
                        React.createElement("span", { className: "hidden-xs", style: { paddingRight: "1em", } },
                            React.createElement(search_1.default, { style: { height: "36px", color: 'inherit' } })),
                        React.createElement(AutoComplete_1.default, { className: "autoComplete", hintText: React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)"), dataSource: this.state.dataSource, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this), menuStyle: { minWidth: '500px' }, style: { height: '36px', width: "auto" }, textFieldStyle: { position: 'absolute', height: "36px" }, textareaStyle: { top: "7px" } })) }) :
                React.createElement(AppBar_1.default, { title: React.createElement("span", null, "\u73FE\u6B63\u4E0A\u6620"), titleStyle: { fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px" }, onLeftIconButtonTouchTap: this.handleToggle, iconStyleLeft: { marginTop: "4px" }, iconElementRight: React.createElement(IconButton_1.default, { className: "visible-xs" },
                        React.createElement(search_1.default, null)), iconStyleRight: { marginTop: "4px", marginRight: '0' }, onRightIconButtonTouchTap: this.handleSearchToggle, className: `appBar`, style: { height: "56px" }, zDepth: 2, children: React.createElement("div", { onClick: this.handleSearchToggle, className: "hidden-xs searchArea", style: { color: 'white', backgroundColor: '#4DD0E1' } },
                        React.createElement("span", { className: "hidden-xs", style: { paddingRight: "1em", } },
                            React.createElement(search_1.default, { style: { height: "36px", color: 'inherit' } })),
                        React.createElement(AutoComplete_1.default, { className: "autoComplete", hintText: React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)"), hintStyle: { color: 'inherit' }, dataSource: this.state.dataSource, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this), menuStyle: { minWidth: '500px' }, style: { height: '36px', width: "auto" }, textFieldStyle: { position: 'absolute', height: "36px" }, textareaStyle: { top: "7px" } })) }),
            React.createElement("div", { className: "container", style: { marginTop: '.5em' } },
                this.props.children,
                React.createElement(Drawer_1.default, { docked: false, width: 300, containerStyle: { maxWidth: '75%' }, open: this.state.open, onRequestChange: (open) => this.setState({ open }) },
                    React.createElement(List_1.List, null,
                        React.createElement(List_1.ListItem, { onTouchTap: this.handleClose, leftIcon: React.createElement(movie_1.default, null) }, "\u73FE\u6B63\u4E0A\u6620"))))));
    }
}
exports.default = Home;
//# sourceMappingURL=home.js.map