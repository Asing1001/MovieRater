import * as React from 'react';
import { Router } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import App from './components/app';
import createBrowserHistory from 'history/createBrowserHistory';
import './main.scss';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';

class Root extends React.PureComponent<any, any> {
  createClient() {
    return new ApolloClient({
      initialState: window['__APOLLO_STATE__'] || {},
      ssrForceFetchDelay: 100,
      networkInterface: createNetworkInterface({
        uri: '/graphql',
      }),
    });
  }

  render() {
    return (
      <ApolloProvider client={this.createClient()}>
        <Router history={history}>
          <App />
        </Router>
      </ApolloProvider>
    );
  }
}

const history = createBrowserHistory();
const rootElement = document.getElementById('app');
ReactDOM.render(<Root></Root>, rootElement);

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
