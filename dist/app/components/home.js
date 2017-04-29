"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AutoComplete_1 = require("material-ui/AutoComplete");
require("isomorphic-fetch");
const react_router_1 = require("react-router");
const Drawer_1 = require("material-ui/Drawer");
const movie_1 = require("material-ui/svg-icons/av/movie");
const AppBar_1 = require("material-ui/AppBar");
const List_1 = require("material-ui/List");
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggle = () => this.setState({ open: !this.state.open });
        this.handleClose = () => { this.setState({ open: false }); react_router_1.browserHistory.push(`/`); };
        this.state = {
            searchText: '',
            dataSource: [],
        };
    }
    componentDidMount() {
        this.getDataSource();
        document.querySelector('input').focus();
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
            React.createElement(AppBar_1.default, { onLeftIconButtonTouchTap: this.handleToggle, iconStyleLeft: { marginTop: "0px" }, className: "appBar", style: { height: "48px" }, children: React.createElement(AutoComplete_1.default, { hintText: React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)"), dataSource: this.state.dataSource, fullWidth: true, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this), menuStyle: { minWidth: '500px' } }) }),
            React.createElement("div", { className: "container", style: { marginTop: '.5em' } },
                this.props.children,
                React.createElement(Drawer_1.default, { docked: false, width: 300, containerStyle: { maxWidth: '75%' }, open: this.state.open, onRequestChange: (open) => this.setState({ open }) },
                    React.createElement(List_1.List, null,
                        React.createElement(List_1.ListItem, { onTouchTap: this.handleClose, leftIcon: React.createElement(movie_1.default, null) }, "\u73FE\u6B63\u4E0A\u6620"))))));
    }
}
exports.default = Home;
//# sourceMappingURL=home.js.map