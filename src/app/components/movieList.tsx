import * as React from 'react';
import FindResult from './findResult';
import Movie from '../../models/movie';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import IconLocationOn from 'material-ui/svg-icons/content/sort';
import FontIcon from 'material-ui/FontIcon';
const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

enum SortType {
  imdb = 0,
  yahoo = 1,
  tomato = 2,
  ptt = 3,
}

class MovieList extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: SortType.imdb,
      sortFunction: this.GetStandardSortFunction('imdbRating')
    };
  }

  select = (index) => {
    if(this.state.selectedIndex === index){
      return;
    }
    var sortFunction;
    switch (index) {
      case SortType.imdb:
        sortFunction = this.GetStandardSortFunction('imdbRating');
        break;
      case SortType.ptt:
        sortFunction = (a, b) => this.GetPttRating(b) - this.GetPttRating(a)
        break;
      case SortType.tomato:
        sortFunction = this.GetStandardSortFunction('tomatoRating');
        break;
      case SortType.yahoo:
        sortFunction = this.GetStandardSortFunction('yahooRating');
        break;
    }

    this.setState({ selectedIndex: index, sortFunction: sortFunction });
  }

  GetStandardSortFunction = (propertyName) => {
    return function (a, b) {
      let aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
      let bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
      return bValue - aValue;
    }
  }

  GetPttRating = (movie: Movie) => {
    return movie.goodRateArticles.length - movie.badRateArticles.length;
  }

  render() {
    return (
      <div>
        <Paper zDepth={2} style={{ marginBottom: '.5em' }}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="IMDB"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.imdb)}
              />
            <BottomNavigationItem
              label="YAHOO"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.yahoo)}
              />
            <BottomNavigationItem
              label="TOMATO"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.tomato)}
              />
            <BottomNavigationItem
              label="PTT"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.ptt)}
              />
          </BottomNavigation>
        </Paper>
        {
          this.props.movies.sort(this.state.sortFunction).map((movie: Movie) => (
            <FindResult key={movie.yahooId} movie={movie}></FindResult>
          ))
        }
      </div>
    );
  }
}
export default MovieList;