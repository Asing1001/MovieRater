import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Movie from '../../models/movie';
import MovieDetail from './movieDetail';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

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
            this.setState({ movie: this.classifyArticle(nextProps.movie), slideIndex:this.state.slideIndex });
        }
    }

    private classifyArticle(movie:Movie) {
        if(!movie.relatedArticles) return movie;   
        var [goodRateArticles,normalRateArticles,badRateArticles,otherArticles] = [[],[],[],[]];  
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
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
          >
          <Tab label="Movie Detail" value={0} />
          <Tab label="Ptt" value={1} />
          <Tab label="Summary" value={2} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
          >
          <div style={styles.slide}>
            <MovieDetail movie={this.state.movie}></MovieDetail>
          </div>
          <div style={styles.slide}>
            <MovieDetail movie={this.state.movie}></MovieDetail>
          </div>
          <div style={styles.slide}>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}