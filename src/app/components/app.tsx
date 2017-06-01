import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { Route, Switch } from 'react-router-dom';
import AppBarSearching from './appBarSearching';
import AppBarNormal from './appBarNormal';
import MovieDetailTabs from './movieDetailTabs';
import MovieList from './movieList';
import MovieNotFound from './movieNotFound';
import TheaterList from './theaterList';
import TheaterDetail from './theaterDetail';
import PageNotFound from './pageNotFound';

injectTapEventPlugin();

class App extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
    };
  }

  muiTheme = getMuiTheme({
    userAgent: navigator.userAgent
  })

  handleSearchToggle = () => {
    this.setState({ searching: !this.state.searching });
    setTimeout(() => document.querySelector('input').focus(), 100);
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={this.muiTheme}>
        <div>
          <AppBarNormal
            className={this.state.searching && "vanish"}
            onSearchIconClick={this.handleSearchToggle.bind(this)}> >
        </AppBarNormal>
          <AppBarSearching
            className={!this.state.searching && "vanish"}
            onBackSpaceIconClick={this.handleSearchToggle.bind(this)}>
          </AppBarSearching>
          <div className="container" style={{ marginTop: '.5em' }} >
            <Switch>
              <Route exact path="/" component={MovieList} />
              <Route path="/movie/:id" component={MovieDetailTabs} />
              <Route path="/movielist/:ids" component={MovieList} />
              <Route path="/movienotfound/:query" component={MovieNotFound} />
              <Route path="/theaterlist" component={TheaterList} />
              <Route path="/theater/:name" component={TheaterDetail} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;