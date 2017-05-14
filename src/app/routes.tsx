import * as React from 'react';
import {Route, IndexRoute} from 'react-router'; 
import App from './components/app';
import Home from './components/home';
import MovieDetailTabs from './components/movieDetailTabs';
import MovieList from './components/movieList';
import MovieNotFound from './components/movieNotFound';
import TheaterList from './components/theaterList';
import TheaterDetail from './components/theaterDetail';

export default (
  <Route component={App}>
    <Route path='/' component={Home} >
        <IndexRoute component={MovieList}/>
        <Route path="/movie/:id" component={MovieDetailTabs}/>
        <Route path="/movielist/:ids" component={MovieList}/>
        <Route path="/movienotfound/:query" component={MovieNotFound}/>
        <Route path="/theaterlist" component={TheaterList}/>
        <Route path="/theater/:name" component={TheaterDetail}/>
    </Route>
  </Route>
);