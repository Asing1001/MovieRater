import * as React from 'react';
import * as moment from 'moment';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import MovieCard from './movieCard';
import Movie from '../../models/movie';
import { classifyArticle, requestGraphQL } from '../helper';
import LoadingIcon from './loadingIcon';
import { gql, graphql } from 'react-apollo';

const nearbyIcon = <IconLocationOn />;

const recentMoviesQuery = gql`
         query MovieListing($yahooIds:[Int]){
           movies(yahooIds:$yahooIds) {
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            type,
            runTime,
            yahooRating,
            imdbID,
            imdbRating,
            relatedArticles{title},
            }
          }`;

enum SortType {
  imdb = 0,
  yahoo = 1,
  ptt = 2,
  releaseDate = 3
}

@graphql(recentMoviesQuery, {
  options: ({ match }) => {
    return {
      variables: {
        yahooIds: match.params.ids && match.params.ids.split(',').map(id => parseInt(id))
      },
    } 
  },
})
class MovieList extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: SortType.imdb,
      sortFunction: this.getStandardSortFunction('imdbRating'),
      movies: [],
      isLoading: true
    };
  }

  select = (index) => {
    if (this.state.selectedIndex === index) {
      return;
    }
    var sortFunction;
    switch (index) {
      case SortType.imdb:
        sortFunction = this.getStandardSortFunction('imdbRating');
        break;
      case SortType.ptt:
        sortFunction = (a, b) => this.getPttRating(b) - this.getPttRating(a)
        break;
      case SortType.yahoo:
        sortFunction = this.getStandardSortFunction('yahooRating');
        break;
      case SortType.releaseDate:
        sortFunction = ({ releaseDate: releaseDateA }, { releaseDate: releaseDateB }) => moment(releaseDateB).diff(releaseDateA)
        break;
    }

    this.setState({ selectedIndex: index, sortFunction: sortFunction });
  }

  getStandardSortFunction = (propertyName) => {
    return function (a, b) {
      let aValue = a[propertyName] === 'N/A' ? 0 : a[propertyName];
      let bValue = b[propertyName] === 'N/A' ? 0 : b[propertyName];
      return bValue - aValue;
    }
  }

  getPttRating = (movie: Movie) => {
    return movie.goodRateArticles.length - movie.badRateArticles.length;
  }

  render() {
    if (this.props.data.loading) {
      return <LoadingIcon isLoading={this.props.data.loading} />
    }
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
              label="PTT"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.ptt)}
            />
            <BottomNavigationItem
              label="上映日"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.releaseDate)}
            />
          </BottomNavigation>
        </Paper>
        {
          this.props.data.movies.map(movie => classifyArticle(movie)).sort(this.state.sortFunction).map((movie: Movie, index) => (
            <Paper zDepth={2} className="row no-margin" style={{ marginBottom: '.5em' }} key={index}>
              <MovieCard key={movie.yahooId} movie={movie}></MovieCard>
            </Paper>
          ))
        }
      </div>
    );
  }
}
export default MovieList;