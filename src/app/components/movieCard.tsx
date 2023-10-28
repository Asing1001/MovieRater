import * as React from 'react';
import Movie from '../../models/movie';
import Ratings from './ratings';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

interface MovieDetailProps {
  movie: Movie;
  roomTypes?: string[];
}

class MovieCard extends React.PureComponent<MovieDetailProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { roomTypes, movie } = this.props;
    return (
      <article className="card" style={{ display: 'flex' }}>
        <Link to={`/movie/${movie.movieBaseId}`}>
          <LazyLoad>
            <img
              className="poster"
              src={movie.posterUrl}
              alt="Image not found"
            />
          </LazyLoad>
        </Link>
        <div className="col-xs-12">
          <header style={{ paddingTop: '.5em' }}>
            <Link style={{ color: 'inherit' }} to={`/movie/${movie.movieBaseId}`}>
              <h3 className="title">
                {movie.chineseTitle}
                {roomTypes && roomTypes.length > 0 && (
                  <span style={{ marginLeft: '.2em' }}>
                    {roomTypes.map((roomType, index) => roomType)}
                  </span>
                )}
              </h3>
            </Link>
            <Link style={{ color: 'inherit' }} to={`/movie/${movie.movieBaseId}`}>
              <small>{movie.englishTitle}</small>
            </Link>
          </header>
          <div className="resultInfo">
            <Link style={{ color: 'inherit' }} to={`/movie/${movie.movieBaseId}`}>
              <div>上映日期：{movie.releaseDate || '未提供'}</div>
              <div className="hidden-xs">
                類型：{movie.types.join('、') || '未提供'}
              </div>
              <div>片長：{movie.runTime}</div>
            </Link>
          </div>
          <Ratings
            className="resultRatings"
            style={{ marginTop: '.3em', marginBottom: '.3em' }}
            movie={movie}
          ></Ratings>
          {this.props.children}
        </div>
      </article>
    );
  }
}

export default MovieCard;
