import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import App from './components/app';
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
        <BrowserRouter>
          <App />
        </BrowserRouter>
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