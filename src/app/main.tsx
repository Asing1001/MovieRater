import * as React from 'react';
import { Router } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import App from './components/app';
import createBrowserHistory from 'history/createBrowserHistory';
import './main.css';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';

class Root extends React.Component<any, any> {
  createClient() {
    return new ApolloClient({
      initialState: window["__APOLLO_STATE__"] || {},
      ssrForceFetchDelay: 100,
      networkInterface: createNetworkInterface({
        uri: '/graphql'
      })
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
history.listen((location, action) => {
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
  console.log(`The last navigation action was ${action}`)
  const dataLayer = window['dataLayer'];
  if (dataLayer) {
    dataLayer.push({
      'event': 'virtualPageView',
      'page': {
        'url': location.pathname
      }
    });
  }
})

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