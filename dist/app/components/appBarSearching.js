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
const AutoComplete_1 = require("material-ui/AutoComplete");
require("isomorphic-fetch");
const search_1 = require("material-ui/svg-icons/action/search");
const clear_1 = require("material-ui/svg-icons/content/clear");
const keyboard_backspace_1 = require("material-ui/svg-icons/hardware/keyboard-backspace");
const IconButton_1 = require("material-ui/IconButton");
const Paper_1 = require("material-ui/Paper");
const react_apollo_1 = require("react-apollo");
const allMoviesNamesQuery = react_apollo_1.gql `
  query AllMoviesNames {
    allMoviesNames
    {
      value
      text
    }
  }
`;
let AppBarSearching = class AppBarSearching extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
    }
    clearSearchText() {
        this.setState({ searchText: '' });
        requestAnimationFrame(() => document.querySelector('input').focus());
    }
    handleUpdateInput(text) { this.setState({ searchText: text }); }
    onNewRequest(selectItem, index, filteredList) {
        let yahooIds = [];
        let searchText = '';
        if (index === -1) {
            searchText = selectItem.toLowerCase();
            if (!filteredList) {
                yahooIds = this.props.data.allMoviesNames.filter(({ value, text }) => text.toLowerCase().indexOf(searchText) !== -1).map(({ value }) => parseInt(value)).slice(0, 6);
            }
            else {
                yahooIds = filteredList.map(({ value }) => parseInt(value.key)).slice(0, 6);
            }
        }
        else {
            yahooIds.push(parseInt(selectItem.value));
        }
        if (yahooIds.length === 0) {
            this.context.router.history.push(`/movienotfound/${searchText}`);
        }
        else if (yahooIds.length === 1) {
            this.context.router.history.push(`/movie/${yahooIds}`);
        }
        else {
            this.context.router.history.push(`/movies/${yahooIds}`);
        }
    }
    render() {
        if (this.props.data.loading) {
            return null;
        }
        return (React.createElement(Paper_1.default, { zDepth: 2, className: `appBar searching ${this.props.className}` },
            React.createElement(IconButton_1.default, { className: "leftBtn", onTouchTap: e => { e.preventDefault(); this.props.onBackSpaceIconClick(); } },
                React.createElement(keyboard_backspace_1.default, null)),
            React.createElement("span", { className: "hidden-xs barTitle" }, "\u4E0A\u4E00\u6B65"),
            React.createElement("span", { className: "searchArea" },
                React.createElement(search_1.default, { className: "hidden-xs searchIcon" }),
                React.createElement(AutoComplete_1.default, { hintText: React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)"), dataSource: this.props.data.allMoviesNames, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 8, onNewRequest: this.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this), menuStyle: { minWidth: "500px" }, fullWidth: true })),
            React.createElement(IconButton_1.default, { onTouchTap: e => { e.preventDefault(); this.clearSearchText(); }, className: "visible-xs rightBtn" },
                React.createElement(clear_1.default, null))));
    }
};
AppBarSearching.contextTypes = {
    router: React.PropTypes.object
};
AppBarSearching = __decorate([
    react_apollo_1.graphql(allMoviesNamesQuery, {
        options: { ssr: false }
    }),
    __metadata("design:paramtypes", [Object])
], AppBarSearching);
exports.default = AppBarSearching;
//# sourceMappingURL=appBarSearching.js.map