"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const appDrawer_1 = require("./appDrawer");
const search_1 = require("material-ui/svg-icons/action/search");
const menu_1 = require("material-ui/svg-icons/navigation/menu");
const Paper_1 = require("material-ui/Paper");
const IconButton_1 = require("material-ui/IconButton");
const colors_1 = require("material-ui/styles/colors");
const normalStyles = {
    backgroundColor: colors_1.cyan500,
    color: 'white'
};
class AppBarNormal extends React.Component {
    constructor(props) {
        super(props);
        this.drawerToggle = null;
    }
    render() {
        return (React.createElement(Paper_1.default, { zDepth: 2, className: `appBar normal ${this.props.className}`, style: normalStyles },
            React.createElement(IconButton_1.default, { className: "leftBtn", onTouchTap: () => this.drawerToggle() },
                React.createElement(menu_1.default, { color: normalStyles.color })),
            React.createElement("span", { className: "barTitle" }, "\u73FE\u6B63\u4E0A\u6620"),
            React.createElement("span", { onClick: this.props.onSearchIconClick, className: "hidden-xs searchArea", style: { backgroundColor: colors_1.cyan300 } },
                React.createElement(search_1.default, { className: "searchIcon", color: normalStyles.color }),
                React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)")),
            React.createElement(IconButton_1.default, { onTouchTap: this.props.onSearchIconClick, className: "visible-xs rightBtn" },
                React.createElement(search_1.default, { color: normalStyles.color })),
            React.createElement(appDrawer_1.default, { ref: instance => this.drawerToggle = instance && instance.toggle })));
    }
}
exports.default = AppBarNormal;
//# sourceMappingURL=appBarNormal.js.map