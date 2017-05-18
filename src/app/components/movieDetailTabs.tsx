import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { Route, } from 'react-router';
import Paper from 'material-ui/Paper';
import Movie from '../../models/movie';
import MovieDetail from './movieDetail';
import PttArticles from './pttArticles';
import Schedules from './schedules';
import { classifyArticle, requestGraphQL } from '../helper';
import LoadingIcon from './loadingIcon';

interface MovieDetailState {
  movie?: Movie,
  slideIndex?: number,
  isLoading?: boolean
}

const ALLDATA = `{
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            type,
            runTime,
            director,
            actor,
            launchCompany,
            companyUrl,
            yahooRating,
            imdbID,
            imdbRating,
            tomatoURL            ,
            tomatoRating,
            relatedArticles{title,push,url,date,author},
            summary,
            schedules {
              theaterName,
              timesStrings,
              roomTypes,
              theaterExtension {
                phone,
                region,
                regionIndex,
                location {
                  lat,
                  lng,
                }
              }
            }
          }`;

export default class MovieDetailTabs extends React.Component<any, MovieDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      movie: {},
      slideIndex: 0,
      isLoading: true
    }
  }

  componentDidMount() {
    this.search([parseInt(this.props.match.params.id)]);
  }

  componentWillReceiveProps(nextProps) {
    this.search([parseInt(nextProps.match.params.id)]);
  }

  search(yahooIds: Number[]) {
    this.setState({ isLoading: true });
    requestGraphQL(`
        {
          movies(yahooIds:${JSON.stringify(yahooIds)})${ALLDATA}
        }
    `)
      .then((json: any) => {
        this.setState({
          movie: json.data.movies.map(movie => classifyArticle(movie))[0],
          isLoading: false,
        });
      });
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  handleSlideHeight = () => {
    const slides = document.querySelectorAll("[role='option']") as NodeListOf<HTMLDivElement>;
    Array.from(slides).forEach((slide, index) => {
      slide.style.height = index === this.state.slideIndex ? 'auto' : '500px';
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.handleSlideHeight()
  };

  render() {
    return this.state.isLoading ? <LoadingIcon isLoading={this.state.isLoading} /> :
      (<Paper zDepth={2}>
        <Tabs
          onChange={this.handleChange.bind(this)}
          value={this.state.slideIndex}
        >
          <Tab label="Detail" value={0} />
          <Tab label="Ptt" value={1} />
          <Tab label="Summary" value={2} />
          {
            this.state.movie.schedules.length > 0 && <Tab label="Time" value={3} />
          }
        </Tabs>
        <div className="swipeViewWrapper">
          <SwipeableViews
            slideStyle={{ height: '500px', paddingBottom: '1em' }}
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange.bind(this)}
            threshold={6}
          >
            <MovieDetail movie={this.state.movie}></MovieDetail>
            <PttArticles movie={this.state.movie}></PttArticles>
            <div className="col-xs-12" style={{ paddingTop: '1em' }} dangerouslySetInnerHTML={{ __html: this.state.movie.summary }}></div>
            <Schedules schedules={this.state.movie.schedules}></Schedules>
          </SwipeableViews>
        </div>
      </Paper>
      );
  }
}