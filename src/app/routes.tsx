import * as React from 'react';
import {Route, IndexRoute} from 'react-router'; 
import App from './components/app';
import Home from './components/home';
import MovieDetailTabs from './components/movieDetailTabs';
import MovieList from './components/movieList';

export default (
  <Route component={App}>
    <Route path='/' component={Home} >
        <IndexRoute component={MovieList}/>
        <Route path="/movie/:id" component={MovieDetailTabs}/>
        <Route path="/movielist/:ids" component={MovieList}/>
    </Route>
  </Route>
);