import * as React from 'react';
import { Router } from 'react-router';
import * as ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import './main.css';

class Root extends React.Component<any, any> {
  render() {
    return (
      <Router history={createBrowserHistory()}>{routes}</Router>
    );
  }
}

const rootElement = document.getElementById('app');
ReactDOM.render(<Root></Root>, rootElement);

//for hot module reload
declare var module;
if (module.hot) {
  module.hot.accept();
}

