import * as React from 'react';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/content/sort';
import MovieCard from './movieCard';
import Movie from '../../models/movie';
import { classifyArticle } from '../helper';
import LoadingIcon from './loadingIcon';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

const nearbyIcon = <IconLocationOn />;

const movieListingQuery = gql`
  query MovieListing($ids: [ID], $range: String) {
    movies(ids: $ids, range: $range) {
      movieBaseId
      lineUrlHash
      lineRating
      yahooId
      posterUrl
      chineseTitle
      englishTitle
      releaseDate
      types
      runTime
      yahooRating
      imdbID
      imdbRating
      relatedArticles {
        title
      }
      briefSummary
    }
  }
`;

@graphql(movieListingQuery, {
  options: ({ match }) => {
    return {
      variables: {
        ids:
          match.params.ids &&
          match.params.ids.split(','),
        range: match.path.replace('/', ''),
      },
    };
  },
})
class MovieList extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      isLoading: true,
    };
  }
  render() {
    if (this.props.data.loading) {
      return <LoadingIcon isLoading={this.props.data.loading} />;
    }
    return (
      <div>
        {this.props.data.movies
          .map((movie) => classifyArticle(movie))
          .sort(this.props.sortFunction)
          .map((movie: Movie, index) => (
            <Paper
              zDepth={2}
              className="row no-margin"
              style={{ marginBottom: '.5em' }}
              key={index}
            >
              <MovieCard key={movie.movieBaseId} movie={movie}>
                <Link
                  style={{ color: 'inherit' }}
                  to={`/movie/${movie.movieBaseId}`}
                >
                  {movie.briefSummary && (
                    <div className="hidden-xs">
                      <p className="resultSummary">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: movie.briefSummary,
                          }}
                        ></span>
                      </p>
                    </div>
                  )}
                </Link>
              </MovieCard>
            </Paper>
          ))}
      </div>
    );
  }
}
export default MovieList;
