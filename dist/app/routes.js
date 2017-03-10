"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var app_1 = require("./components/app");
var home_1 = require("./components/home");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (React.createElement(react_router_1.Route, { component: app_1.default },
    React.createElement(react_router_1.Route, { path: '/', component: home_1.default },
        React.createElement(react_router_1.Route, { path: "/movie/:id", component: home_1.default }))));
//# sourceMappingURL=routes.js.map