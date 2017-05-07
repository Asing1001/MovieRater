"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const appBarSearching_1 = require("./appBarSearching");
const appBarNormal_1 = require("./appBarNormal");
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearchToggle = () => {
            this.setState({ searching: !this.state.searching });
            setTimeout(() => document.querySelector('input').focus(), 100);
        };
        this.state = {
            searching: false,
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(appBarSearching_1.default, { className: !this.state.searching && "hidden", onBackSpaceIconClick: this.handleSearchToggle }),
            React.createElement(appBarNormal_1.default, { className: this.state.searching && "hidden", onSearchIconClick: this.handleSearchToggle }, " >"),
            React.createElement("div", { className: "container", style: { marginTop: '.5em' } }, this.props.children)));
    }
}
exports.default = Home;
//# sourceMappingURL=home.js.map