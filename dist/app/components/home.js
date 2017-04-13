"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AutoComplete_1 = require("material-ui/AutoComplete");
require("isomorphic-fetch");
const react_router_1 = require("react-router");
class Home extends React.Component {
    constructor(props) {
        super(props);
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
        fetch('/graphql', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: "{allMoviesNames{value,text}}" }),
            credentials: 'include',
        }).then(res => res.json())
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
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "autoCompleteWrapper" },
                React.createElement(AutoComplete_1.default, { hintText: "電影名稱(中英皆可)", dataSource: this.state.dataSource, floatingLabelText: "找電影", fullWidth: true, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this) }),
                React.createElement("button", { className: `clearButton ${this.state.searchText ? '' : 'displayNone'}`, onClick: this.clearSearchText.bind(this) }, "X")),
            this.props.children));
    }
}
exports.default = Home;
//# sourceMappingURL=home.js.map