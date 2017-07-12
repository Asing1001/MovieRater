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

    private getSmallPosterSrc(posterUrl: string) {
        return posterUrl && posterUrl.replace('mpost', 'mpost3');
    }

    render() {
        const { roomTypes, movie, timesStrings } = this.props;
        return (
            <article style={{ display: 'flex' }}>
                <Link to={`/movie/${movie.yahooId}`} >
                    <img src={this.getSmallPosterSrc(movie.posterUrl)} />
                </Link>
                <div className="col-xs-12">
                    <header style={{ paddingTop: '.5em' }}>
                        <Link style={{ color: 'inherit' }} to={`/movie/${movie.yahooId}`}>
                            <strong style={{ display: 'flex', alignItems: 'center', lineHeight: '1em' }}>
                                {movie.chineseTitle}
                                {roomTypes && roomTypes.length > 0 && <span style={{ marginLeft: '.2em' }}>
                                    {roomTypes.map((roomType,index) => <img key={index} src={`https://s.yimg.com/f/i/tw/movie/movietime_icon/icon_${roomType}.gif`} />)}
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