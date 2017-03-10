"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var App = (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.muiTheme = getMuiTheme_1.default({
            userAgent: navigator.userAgent,
        });
        return _this;
    }
    App.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1.default, { muiTheme: this.muiTheme }, this.props.children));
    };
    return App;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
//# sourceMappingURL=app.js.map