import * as React from 'react';
import { Router } from 'react-router';
import * as ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import routes from './routes';
import './main.css';

class Root extends React.Component<any, any> {
  render() {
    return (
      <Router history={browserHistory}>{routes}</Router>
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