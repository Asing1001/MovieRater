import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { Route, } from 'react-router';
import Paper from 'material-ui/Paper';
import Movie from '../../models/movie';
import MovieDetail from './movieDetail';
import PttArticles from './pttArticles';
import Schedules from './schedules';
import { classifyArticle } from '../helper';
import LoadingIcon from './loadingIcon';
import { gql, graphql } from 'react-apollo';

interface MovieDetailState {
  movie?: Movie,
  slideIndex?: number,
  isLoading?: boolean
}

const movieDetailQuery = gql`
 query MovieListing($yahooIds:[Int]){
  movies(yahooIds:$yahooIds) {
    yahooId
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
    relatedArticles{
      title
      push
      url
      date
      author
    }
    summary
    schedules {              
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
}`;

@graphql(movieDetailQuery, {
  options: ({ match }) => {
    return {
      variables: {
        yahooIds: match.params.id
      }
    }
  },
})
export default class MovieDetailTabs extends React.Component<any, MovieDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      slideIndex: 0,
    }
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleSlideHeight = () => {
    // const slides = document.querySelectorAll("[role='option']") as NodeListOf<HTMLDivElement>;
    // Array.from(slides).forEach((slide, index) => {
    //   slide.style.height = index === this.state.slideIndex ? 'auto' : '500px';
    // })
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.handleSlideHeight()
  };
  
  render() {
    const { data: { loading, movies } } = this.props;
    if (loading) {
      return <LoadingIcon isLoading={loading} />
    }
    const movie = classifyArticle(movies[0]);
    return <Paper zDepth={2}>
      <Tabs
        onChange={this.handleChange.bind(this)}
        value={this.state.slideIndex}
      >
        <Tab label="Detail" value={0} />
        <Tab label="Ptt" value={1} />
        <Tab label="Summary" value={2} />
        {
          movie.schedules.length > 0 && <Tab label="Time" value={3} />
        }
      </Tabs>
      <div className="swipeViewWrapper">
        <SwipeableViews
          slideStyle={{ height: 'calc(100vh - 111px)', paddingBottom: '1em' }}
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange.bind(this)}
          threshold={6}
        >
          <MovieDetail movie={movie}></MovieDetail>
          <PttArticles movie={movie}></PttArticles>
          <div className="col-xs-12" style={{ paddingTop: '1em' }} dangerouslySetInnerHTML={{ __html: movie.summary }}></div>
          <Schedules schedules={movie.schedules}></Schedules>
        </SwipeableViews>
      </div>
    </Paper>
  }
}