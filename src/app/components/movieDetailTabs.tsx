import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Paper from 'material-ui/Paper';
import Movie from '../../models/movie';
import MovieDetail from './movieDetail';
import PttArticles from './pttArticles';
import Schedules from './schedules';
import { classifyArticle } from '../helper';
import LoadingIcon from './loadingIcon';
import { gql, graphql } from 'react-apollo';
import PageNotFound from './pageNotFound';

interface MovieDetailState {
  movie?: Movie;
  slideIndex?: number;
  isLoading?: boolean;
}

const movieDetailQuery = gql`
  query MovieListing($ids: [ID]) {
    movies(ids: $ids) {
      movieBaseId
      lineUrlHash
      lineRating
      lineTrailerHash
      posterUrl
      chineseTitle
      englishTitle
      releaseDate
      types
      runTime
      directors
      actors
      launchCompany
      companyUrl
      yahooRating
      imdbID
      imdbRating
      tomatoURL
      tomatoRating
      relatedArticles {
        title
        push
        url
        date
        author
      }
      summary
      schedules {
        date
        timesStrings
        roomTypes
        theaterExtension {
          name
          address
          phone
          region
          regionIndex
          location {
            lat
            lng
          }
        }
      }
    }
  }
`;

@graphql(movieDetailQuery, {
  options: ({ match }) => {
    return {
      variables: {
        ids: [match.params.id],
      },
    };
  },
})
export default class MovieDetailTabs extends React.PureComponent<any, MovieDetailState> {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    const {
      data: { loading, movies },
    } = this.props;
    if (loading) {
      return <LoadingIcon isLoading={loading} />;
    }
    const matchedMovie = movies[0];
    if (!matchedMovie) {
      return <PageNotFound />;
    }
    const movie = classifyArticle(matchedMovie);
    const { chineseTitle, englishTitle, posterUrl } = movie;

    document.title = `${chineseTitle} ${englishTitle} | Movie Rater | 電影評分 | PTT | IMDb | LINE電影`;
    document['meta'] = {
      image: posterUrl,
      description: generateMovieDescription(movie),
      canonicalUrl: `https://www.mvrater.com/movie/${movie.movieBaseId}`,
    };
    return (
      <Paper zDepth={2}>
        <Tabs onChange={this.handleChange.bind(this)} value={this.state.slideIndex}>
          <Tab label="電影資訊" value={0} />
          {movie.schedules.length > 0 && <Tab label="時刻表" value={1} />}
          <Tab label="Ptt" value={2} />
        </Tabs>
        <div className={`swipeViewWrapper active-${this.state.slideIndex}`}>
          <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange.bind(this)} threshold={6}>
            <MovieDetail movie={movie}></MovieDetail>
            <Schedules schedules={movie.schedules}></Schedules>
            <PttArticles movie={movie}></PttArticles>
          </SwipeableViews>
        </div>
      </Paper>
    );
  }
}

function generateMovieDescription(movie: Movie) {
  const { imdbRating, lineRating, yahooRating, goodRateArticles, normalRateArticles, badRateArticles } = movie;
  const ratings = [];

  if (imdbRating) ratings.push(`IMDb:${imdbRating}`);
  if (lineRating) ratings.push(`LINE電影:${lineRating}`);
  if (yahooRating) ratings.push(`Yahoo:${yahooRating}`);

  return `${ratings.join(', ')}${ratings.length ? ', ' : ''}PTT好雷/普雷/負雷:${goodRateArticles.length}/${
    normalRateArticles.length
  }/${badRateArticles.length}`;
}
