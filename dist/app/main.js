"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_router_1 = require('react-router');
var ReactDOM = require('react-dom');
var createBrowserHistory_1 = require('history/lib/createBrowserHistory');
var routes_1 = require('./routes');
require('./main.css');
var Root = (function (_super) {
    __extends(Root, _super);
    function Root() {
        _super.apply(this, arguments);
    }
    Root.prototype.render = function () {
        return (React.createElement(react_router_1.Router, {history: createBrowserHistory_1.default()}, routes_1.default));
    };
    return Root;
}(React.Component));
var rootElement = document.getElementById('app');
ReactDOM.render(React.createElement(Root, null), rootElement);
if (module.hot) {
    module.hot.accept();
}
//# sourceMappingURL=main.js.map