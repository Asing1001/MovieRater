import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Movie from '../../models/movie';
import MovieDetail from './movieDetail';
import PttArticles from './pttArticles';

interface MovieDetailProps {
  movie: Movie
}

interface MovieDetailState {
  movie: Movie,
  slideIndex: number
}

export default class MovieDetailTabs extends React.Component<MovieDetailProps, MovieDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      movie: new Movie(),
      slideIndex: 0
    }
  }

  handleChange = (value) => {
    this.setState({
      movie: this.state.movie,
      slideIndex: value
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.movie !== this.state.movie) {
      this.setState({ movie: this.classifyArticle(nextProps.movie), slideIndex: this.state.slideIndex });
    }
  }

  private classifyArticle(movie: Movie) {
    if (!movie.relatedArticles) return movie;
    var [goodRateArticles, normalRateArticles, badRateArticles, otherArticles] = [[], [], [], []];
    movie.relatedArticles.forEach((article) => {
      let title = article.title;
      if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
        goodRateArticles.push(article);
      } else if (title.indexOf('普雷') !== -1) {
        normalRateArticles.push(article)
      } else if (title.indexOf('負雷') !== -1) {
        badRateArticles.push(article)
      } else {
        otherArticles.push(article);
      }
    });
    movie.goodRateArticles = goodRateArticles;
    movie.normalRateArticles = normalRateArticles;
    movie.badRateArticles = badRateArticles;
    movie.otherArticles = otherArticles;
    return movie;
  }

  render() {
    if (!this.state.movie.chineseTitle) { return null }
    return (
      <div>
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
          <MovieDetail movie={this.state.movie}></MovieDetail>
          <PttArticles movie={this.state.movie}></PttArticles>
          <div className="col-xs-12">{this.state.movie.summary}</div>
        </SwipeableViews>
      </div>
    );
  }
}