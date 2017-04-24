import * as React from 'react';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import FindResult from './findResult';
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
            briefSummary
            }
          }`;

enum SortType {
  imdb = 0,
  yahoo = 1,
  tomato = 2,
  ptt = 3,
}

@graphql(recentMoviesQuery, {
  options: ({ params }) => {
    return params.ids ? {
      variables: {
        yahooIds: params.ids.split(',').map(id => parseInt(id))
      }
    }:{}
  },
})
class MovieListing extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: SortType.imdb,
      sortFunction: this.getStandardSortFunction('imdbRating'),
      movies: [],
      isLoading: true
    };
  }

  getData(ids) {
    // this.setState({ isLoading: true });
    // if (ids) {
    //   const yahooIds = JSON.stringify(ids.split(',').map(id => parseInt(id)));
    //   requestGraphQL(`
    //     {
    //       movies(yahooIds:${yahooIds})${BRIEFDATA}
    //     }
    //     `)
    //     .then((json: any) => {
    //       this.setState({ movies: json.data.movies.map(movie => classifyArticle(movie)), isLoading: false });
    //     });
    // }
    // else {
    //   requestGraphQL(`{recentMovies${BRIEFDATA}}`).then((json: any) => {
    //     this.setState({ movies: json.data.recentMovies.map(movie => classifyArticle(movie)), isLoading: false });
    //   });
    // }
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.params.ids);
  }

  componentWillMount() {
    // this.setState({movie:this.props.data.recentMovies})
    // this.getData(this.props.params.ids);
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
      case SortType.tomato:
        sortFunction = this.getStandardSortFunction('tomatoRating');
        break;
      case SortType.yahoo:
        sortFunction = this.getStandardSortFunction('yahooRating');
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
              label="TOMATO"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.tomato)}
              className="hide"
            />
            <BottomNavigationItem
              label="PTT"
              icon={nearbyIcon}
              onTouchTap={() => this.select(SortType.ptt)}
            />
          </BottomNavigation>
        </Paper>
        {/*<FindResultList />*/}
        {
          this.props.data.movies.map(movie => classifyArticle(movie)).sort(this.state.sortFunction).map((movie: Movie) => (
            <FindResult key={movie.yahooId} movie={movie}></FindResult>
          ))
        }
      </div>
    );
  }
}
export default MovieListing;