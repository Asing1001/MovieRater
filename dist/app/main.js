"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const ReactDOM = require("react-dom");
const app_1 = require("./components/app");
require("./main.css");
const react_apollo_1 = require("react-apollo");
class Root extends React.Component {
    createClient() {
        return new react_apollo_1.ApolloClient({
            initialState: window["__APOLLO_STATE__"] || {},
            ssrForceFetchDelay: 100,
            networkInterface: react_apollo_1.createNetworkInterface({
                uri: '/graphql'
            })
        });
    }
    render() {
        return (React.createElement(react_apollo_1.ApolloProvider, { client: this.createClient() },
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement(app_1.default, null))));
    }
}
const rootElement = document.getElementById('app');
ReactDOM.render(React.createElement(Root, null), rootElement);
// //for hot module reload
// declare var module;
// if (module.hot) {
//   module.hot.accept();
// }
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then(reg => console.log('SW registered!', reg))
        .catch(err => console.log('Error!', err));
}
//# sourceMappingURL=main.js.map