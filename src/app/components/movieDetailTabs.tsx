import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { Route, } from 'react-router';
import Paper from 'material-ui/Paper';
import Movie from '../../models/movie';
import MovieDetail from './movieDetail';
import PttArticles from './pttArticles';
import { classifyArticle, requestGraphQL } from '../helper';

interface MovieDetailState {
  movie: Movie,
  slideIndex: number
}

const ALLDATA = `{
            yahooId
            posterUrl
            chineseTitle
            englishTitle
            releaseDate
            type
            runTime
            director
            actor
            launchCompany
            companyUrl
            yahooRating
            imdbID
            imdbRating
            tomatoURL            
            tomatoRating
            relatedArticles{title,push,url,date,author}
            summary
          }`;

export default class MovieDetailTabs extends React.Component<any, MovieDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      movie: {},
      slideIndex: 0
    }
  }

  componentWillMount() {
    this.search([parseInt(this.props.params.id)]);
  }

  handleChange = (value) => {
    this.setState({
      movie: this.state.movie,
      slideIndex: value
    });
  };

  componentWillReceiveProps(nextProps) {
    this.search([parseInt(nextProps.params.id)]);
  }

  private search(yahooIds: Number[]) {
    requestGraphQL(`
        {
          movies(yahooIds:${JSON.stringify(yahooIds)})${ALLDATA}
        }
    `)
      .then((json: any) => {
        this.setState({
          slideIndex: this.state.slideIndex,
          movie: json.data.movies.map(movie => classifyArticle(movie))[0]
        });
      });
  }

  render() {
    if (!this.state.movie.chineseTitle) { return null }
    return (
      <Paper zDepth={2}>

        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab label="Detail" value={0} />
          <Tab label="Ptt" value={1} />
          <Tab label="Summary" value={2} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div style={{ height: this.state.slideIndex === 0 ? 'auto' : 0 }}>
            <MovieDetail movie={this.state.movie}></MovieDetail>
          </div>
          <div style={{ height: this.state.slideIndex === 1 ? 'auto' : 0 }}>
            <PttArticles movie={this.state.movie}></PttArticles>
          </div>
          <div className="col-xs-12" style={{ paddingTop: '1em', height: this.state.slideIndex === 2 ? 'auto' : 0 }} dangerouslySetInnerHTML={{ __html: this.state.movie.summary }}></div>
        </SwipeableViews>
      </Paper>
    );
  }
}