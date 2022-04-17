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
import { getSortFunction, SortType } from '../sorting';
import { blueGrey800, blueGrey900 } from 'material-ui/styles/colors';

injectTapEventPlugin();

class App extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      sortFunction: getSortFunction(SortType.releaseDate)
    };
  }

  muiTheme = getMuiTheme({
    userAgent: navigator.userAgent,
    palette: {
      primary1Color: blueGrey900,
      primary2Color: blueGrey800,
    },
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
            onSearchIconClick={this.handleSearchToggle.bind(this)}
            switchSorting={(sortType) => this.setState({ sortFunction: getSortFunction(sortType) })}
          >
          </AppBarNormal>
          <AppBarSearching
            className={!this.state.searching && "vanish"}
            onBackSpaceIconClick={this.handleSearchToggle.bind(this)}>
          </AppBarSearching>
          <div className="container" style={{ marginTop: '.5em' }} >
            <Switch>
              <Route exact path="/" render={(props) => {
                document.title = `現正上映 - Movie Rater`;
                return <MovieList {...props} sortFunction={this.state.sortFunction} />
              }} />
              <Route path="/upcoming" render={(props) => {
                document.title = `即將上映 - Movie Rater`;
                return <MovieList {...props} sortFunction={this.state.sortFunction} />
              }} />
              <Route path="/movie/:id" component={MovieDetailTabs} />
              <Route path="/movies/:ids" render={(props) => <MovieList {...props} sortFunction={this.state.sortFunction} />} />
              <Route path="/movienotfound/:query" component={MovieNotFound} />
              <Route path="/theaters" component={TheaterList} />
              <Route path="/theater/:name" render={(props) => <TheaterDetail {...props} sortFunction={this.state.sortFunction} />} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;