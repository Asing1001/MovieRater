"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_1 = require("react-router");
const app_1 = require("./components/app");
const home_1 = require("./components/home");
const movieDetailTabs_1 = require("./components/movieDetailTabs");
const movieList_1 = require("./components/movieList");
exports.default = (React.createElement(react_router_1.Route, { component: app_1.default },
    React.createElement(react_router_1.Route, { path: '/', component: home_1.default },
        React.createElement(react_router_1.IndexRoute, { component: movieList_1.default }),
        React.createElement(react_router_1.Route, { path: "/movie/:id", component: movieDetailTabs_1.default }),
        React.createElement(react_router_1.Route, { path: "/movielist/:ids", component: movieList_1.default }))));
//# sourceMappingURL=routes.js.map