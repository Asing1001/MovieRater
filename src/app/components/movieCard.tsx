import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';
import { Link } from 'react-router-dom';
import TimeList from './timeList';
import LazyLoad from 'react-lazyload';

interface MovieDetailProps {
    movie: Movie,
    timesStrings?: String[],
    roomTypes?: String[],
}

class MovieCard extends React.PureComponent<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    private getSmallPosterSrc({ yahooId, posterUrl }: Movie) {
        // "https://s.yimg.com/vu/movies/fp/mpost/64/01/6401.jpg"
        // "https://movies.yahoo.com.tw/y/r/w158/vu/movies/fp/mpost/64/01/6401.jpg"
        // "https://movies.yahoo.com.tw/i/o/production/movies/October2017/j5FRcQyIjAdjfmcLqcpf-1000x1429.jpg"
        // "https://movies.yahoo.com.tw/x/r/w158/i/o/production/movies/October2017/j5FRcQyIjAdjfmcLqcpf-1000x1429.jpg"
        if (!posterUrl)
            return "";

        const suffix = posterUrl.split('/').slice(3).join('/');
        const isOldDomain = posterUrl.indexOf('s.yimg.com') !== -1;
        const prefix = yahooId < 6962 && isOldDomain ? 'y' : 'x';
        return `https://movies.yahoo.com.tw/${prefix}/r/w158/${suffix}`
    }

    render() {
        const { roomTypes, movie, timesStrings } = this.props;
        return (
            <article className="card" style={{ display: 'flex' }}>
                <Link to={`/movie/${movie.yahooId}`} >
                    <LazyLoad>
                        <img className="poster" src={this.getSmallPosterSrc(movie)} alt="Image not found" />
                    </LazyLoad>
                </Link>
                <div className="col-xs-12">
                    <header style={{ paddingTop: '.5em' }}>
                        <Link style={{ color: 'inherit' }} to={`/movie/${movie.yahooId}`}>
                            <h3 className="title">
                                {movie.chineseTitle}
                                {roomTypes && roomTypes.length > 0 && <span style={{ marginLeft: '.2em' }}>
                                    {roomTypes.map((roomType, index) => roomType)}
                                </span>}
                            </h3>
                        </Link>
                        <Link style={{ color: 'inherit' }} to={`/movie/${movie.yahooId}`}>
                            <small>{movie.englishTitle}</small>
                        </Link>
                    </header>
                    <div className="resultInfo">
                        <Link style={{ color: 'inherit' }} to={`/movie/${movie.yahooId}`}>

                            <div>上映日期：{movie.releaseDate || '未提供'}</div>
                            <div className="hidden-xs">類型：{movie.types.join('、') || '未提供'}</div>
                            <div>片長：{movie.runTime}</div>
                        </Link>
                    </div>
                    <Ratings className="resultRatings" style={{ marginTop: ".3em", marginBottom: ".3em" }} movie={movie}></Ratings>
                    {timesStrings && <TimeList timesStrings={timesStrings}></TimeList>}
                    <Link style={{ color: 'inherit' }} to={`/movie/${movie.yahooId}`} >
                        {movie.briefSummary && <div className="hidden-xs">
                            <p className="resultSummary">
                                <span dangerouslySetInnerHTML={{ __html: movie.briefSummary }}></span>
                            </p>
                        </div>}
                    </Link>
                </div>
            </article>
        );
    };
}

export default MovieCard;