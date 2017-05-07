"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const appDrawer_1 = require("./appDrawer");
const search_1 = require("material-ui/svg-icons/action/search");
const AppBar_1 = require("material-ui/AppBar");
const IconButton_1 = require("material-ui/IconButton");
class AppBarNormal extends React.Component {
    constructor(props) {
        super(props);
        this.drawerToggle = null;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(appDrawer_1.default, { ref: instance => this.drawerToggle = instance && instance.toggle }),
            React.createElement(AppBar_1.default, { title: React.createElement("span", null, "\u73FE\u6B63\u4E0A\u6620"), titleStyle: { fontSize: "19.5px", lineHeight: "56px", flex: 'none', width: "126px" }, onLeftIconButtonTouchTap: () => this.drawerToggle(), iconStyleLeft: { marginTop: "4px" }, iconElementRight: React.createElement(IconButton_1.default, { className: "visible-xs", style: { paddingRight: "40px" } },
                    React.createElement(search_1.default, null)), iconStyleRight: { marginTop: "4px", marginRight: '0' }, onRightIconButtonTouchTap: this.props.onSearchIconClick, className: `appBar ${this.props.className}`, style: { height: "56px" }, zDepth: 2, children: React.createElement("div", { onClick: this.props.onSearchIconClick, className: "hidden-xs searchArea", style: { color: 'white', backgroundColor: '#4DD0E1', display: 'flex', alignItems: "center" } },
                    React.createElement("span", { className: "hidden-xs", style: { paddingRight: "1em", marginTop: "4px" } },
                        React.createElement(search_1.default, { style: { height: "36px", color: 'inherit' } })),
                    React.createElement("span", { style: { fontSize: "16px" } }, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)")) })));
    }
}
exports.default = AppBarNormal;
//# sourceMappingURL=appBarNormal.js.map