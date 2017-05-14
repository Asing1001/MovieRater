"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_1 = require("react-router");
const Drawer_1 = require("material-ui/Drawer");
const movie_1 = require("material-ui/svg-icons/av/movie");
const theaters_1 = require("material-ui/svg-icons/action/theaters");
const List_1 = require("material-ui/List");
class AppDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = (url) => {
            this.setState({ open: false });
            react_router_1.browserHistory.push(url);
        };
        this.toggle = () => {
            this.setState({ open: !this.state.open });
        };
        this.state = {
            open: false
        };
    }
    render() {
        return (React.createElement(Drawer_1.default, { docked: false, width: 300, containerStyle: { maxWidth: '75%' }, open: this.state.open, onRequestChange: (open) => this.setState({ open }) },
            React.createElement(List_1.List, null,
                React.createElement(List_1.ListItem, { onTouchTap: () => this.handleClose('/'), leftIcon: React.createElement(movie_1.default, null) }, "\u73FE\u6B63\u4E0A\u6620"),
                React.createElement(List_1.ListItem, { onTouchTap: () => this.handleClose('theaterlist'), leftIcon: React.createElement(theaters_1.default, null) }, "\u6232\u9662\u7E3D\u89BD"))));
    }
}
exports.default = AppDrawer;
//# sourceMappingURL=appDrawer.js.map