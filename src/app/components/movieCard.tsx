import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';
import { Link } from 'react-router-dom';
import TimeList from './timeList';

interface MovieDetailProps {
    movie: Movie,
    timesStrings?: String[],
    roomTypes?: String[],
}

class MovieCard extends React.Component<MovieDetailProps, {}> {
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
            <article style={{ display: 'flex' }}>
                <Link to={`/movie/${movie.yahooId}`} >
                    <img className="cardPoster" src={this.getSmallPosterSrc(movie)} alt="Image not found" />
                </Link>
                <div className="col-xs-12">
                    <header style={{ paddingTop: '.5em' }}>
                        <Link style={{ color: 'inherit' }} to={`/movie/${movie.yahooId}`}>
                            <strong style={{ display: 'flex', alignItems: 'center', lineHeight: '1em' }}>
                                {movie.chineseTitle}
                                {roomTypes && roomTypes.length > 0 && <span style={{ marginLeft: '.2em' }}>
                                    {roomTypes.map((roomType, index) => <img key={index} src={`https://s.yimg.com/f/i/tw/movie/movietime_icon/icon_${roomType}.gif`} />)}
                                </span>}
                            </strong>
                            <small>{movie.englishTitle}</small>
                        </Link>
                    </header>
                    <div className="resultInfo">
                        <span>上映日:{movie.releaseDate}</span>
                        <span className="hidden-xs">類型:{movie.types.join('、')}</span>
                        <span>片長:{movie.runTime}</span>
                    </div>
                    <Ratings className="resultRatings" style={{ marginTop: ".3em", marginBottom: ".3em" }} movie={movie}></Ratings>
                    {timesStrings && <TimeList timesStrings={timesStrings}></TimeList>}
                    {movie.briefSummary && <div className="hidden-xs">
                        <p className="resultSummary">
                            <span dangerouslySetInnerHTML={{ __html: movie.briefSummary }}></span>
                            <Link to={`/movie/${movie.yahooId}`} > 繼續閱讀</Link>
                        </p>
                    </div>}
                </div>
            </article>
        );
    };
}

export default MovieCard;