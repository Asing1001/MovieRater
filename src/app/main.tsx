import * as React from 'react';
import { Router, browserHistory } from 'react-router';
import * as ReactDOM from 'react-dom';
import routes from './routes';
import './main.css';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/graphql',
    // opts: { 
    //   method:'GET'       
    // } 
  })
});

class Root extends React.Component<any, any> {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router history={browserHistory}>{routes}</Router>
      </ApolloProvider>
    );
  }
}

const rootElement = document.getElementById('app');
ReactDOM.render(<Root></Root>, rootElement);

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