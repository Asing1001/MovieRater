"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const ReactDOM = require("react-dom");
const app_1 = require("./components/app");
const createBrowserHistory_1 = require("history/createBrowserHistory");
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
            React.createElement(react_router_dom_1.Router, { history: history },
                React.createElement(app_1.default, null))));
    }
}
const history = createBrowserHistory_1.default();
history.listen((location, action) => {
    console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
    console.log(`The last navigation action was ${action}`);
    if (typeof window['ga'] === 'function') {
        window['ga']('set', 'page', location.pathname + location.search);
        window['ga']('send', 'pageview');
    }
});
const rootElement = document.getElementById('app');
ReactDOM.render(React.createElement(Root, null), rootElement);
// //for hot module reload
// declare var module;
// if (module.hot) {
//   module.hot.accept();
// }
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js');
    });
}
//# sourceMappingURL=main.js.map