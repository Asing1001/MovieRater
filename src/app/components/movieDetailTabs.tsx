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
  slideIndex: number
}

export default class MovieDetailTabs extends React.Component<MovieDetailProps, MovieDetailState> {

  constructor(props) {
    super(props)
    this.state = {
      slideIndex: 0
    }
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value
    });
  };

  
  render() {
    if (!this.props.movie.chineseTitle) { return null }
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
          <MovieDetail movie={this.props.movie}></MovieDetail>
          <PttArticles movie={this.props.movie}></PttArticles>
          <div className="col-xs-12" style={{paddingTop:'1em'}} dangerouslySetInnerHTML={{__html: this.props.movie.summary}}></div>
        </SwipeableViews>
      </div>
    );
  }
}