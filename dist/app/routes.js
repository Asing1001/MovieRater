"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_1 = require("react-router");
const app_1 = require("./components/app");
const home_1 = require("./components/home");
exports.default = (React.createElement(react_router_1.Route, { component: app_1.default },
    React.createElement(react_router_1.Route, { path: '/', component: home_1.default },
        React.createElement(react_router_1.Route, { path: "/movie/:id", component: home_1.default }))));
//# sourceMappingURL=routes.js.map