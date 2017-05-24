import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';
import { Link } from 'react-router-dom';

interface MovieDetailProps {
    movie: Movie
}

const isSmallScreen = typeof window !== 'undefined' && window.matchMedia("only screen and (max-width: 760px)").matches;
class MovieCard extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    private getSmallPosterSrc(posterUrl: string) {
        return posterUrl && posterUrl.replace('mpost', isSmallScreen ? 'mpost3' : 'mpost2');
    }

    render() {
        return (
            <article style={{ display: 'flex' }}>
                <Link to={`/movie/${this.props.movie.yahooId}`} >
                    <img src={this.getSmallPosterSrc(this.props.movie.posterUrl)} />
                </Link>
                <div style={{ padding: '0 0 .5em .5em' }}>
                    <header style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                        <Link style={{ color: 'inherit' }} to={`/movie/${this.props.movie.yahooId}`}><b>{this.props.movie.chineseTitle}</b><br /><small>{this.props.movie.englishTitle}</small> </Link>
                        <div className="resultInfo">
                            <span>上映日:{this.props.movie.releaseDate}</span>
                            <span className="hidden-xs">類型:{this.props.movie.type}</span>
                            <span>片長:{this.props.movie.runTime}</span>
                        </div>
                    </header>
                    <Ratings className="resultRatings" movie={this.props.movie}></Ratings>
                    {this.props.movie.briefSummary && <div className="hidden-xs">
                        <p className="resultSummary" dangerouslySetInnerHTML={{ __html: this.props.movie.briefSummary }}></p>
                        <Link to={`/movie/${this.props.movie.yahooId}`} >繼續閱讀...</Link>
                    </div>}

                </div>
            </article>
        );
    };
}

export default MovieCard;