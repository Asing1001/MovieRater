import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';
import { Link } from 'react-router-dom';
import TimeList from './timeList';

interface MovieDetailProps {
    movie: Movie,
    timesStrings?: String[],
}

class MovieCard extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    private getSmallPosterSrc(posterUrl: string) {
        return posterUrl && posterUrl.replace('mpost', 'mpost3');
    }

    render() {
        return (
            <article style={{ display: 'flex' }}>
                <Link to={`/movie/${this.props.movie.yahooId}`} >
                    <img src={this.getSmallPosterSrc(this.props.movie.posterUrl)} />
                </Link>
                <div className="col-xs-12">
                    <header style={{ paddingTop: '.5em' }}>
                        <Link style={{ color: 'inherit' }} to={`/movie/${this.props.movie.yahooId}`}>
                            <strong style={{ display: 'block', lineHeight: '1em' }}>{this.props.movie.chineseTitle}</strong>
                            <small>{this.props.movie.englishTitle}</small>
                        </Link>
                    </header>
                    <div className="resultInfo">
                        <span>上映日:{this.props.movie.releaseDate}</span>
                        <span className="hidden-xs">類型:{this.props.movie.type}</span>
                        <span>片長:{this.props.movie.runTime}</span>
                    </div>
                    <Ratings className="resultRatings" style={{ marginTop: ".3em", marginBottom: ".3em" }} movie={this.props.movie}></Ratings>                    
                    {this.props.timesStrings && <TimeList timesStrings={this.props.timesStrings}></TimeList>}
                </div>
            </article>
        );
    };
}

export default MovieCard;