import * as React from 'react';
import * as moment from 'moment';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import MovieCard from './movieCard';
import Movie from '../../models/movie';
import { classifyArticle } from '../helper';
import LoadingIcon from './loadingIcon';
import { gql, graphql } from 'react-apollo';

const nearbyIcon = <IconLocationOn />;

const movieListingQuery = gql`
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

@graphql(movieListingQuery, {
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
      movies: [],
      isLoading: true
    };
  }
  render() {
    if (this.props.data.loading) {
      return <LoadingIcon isLoading={this.props.data.loading} />
    }
    return (
      <div>
        {
          this.props.data.movies.map(movie => classifyArticle(movie)).sort(this.props.sortFunction).map((movie: Movie, index) => (
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