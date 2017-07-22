"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const Drawer_1 = require("material-ui/Drawer");
const movie_1 = require("material-ui/svg-icons/av/movie");
const List_1 = require("material-ui/List");
class AppDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = () => {
            this.setState({ open: false });
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
                React.createElement(react_router_dom_1.Link, { to: "/" },
                    React.createElement(List_1.ListItem, { onTouchTap: () => this.handleClose(), leftIcon: React.createElement(movie_1.default, null) }, "\u73FE\u6B63\u4E0A\u6620")))));
    }
}
exports.default = AppDrawer;
//# sourceMappingURL=appDrawer.js.map