import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';
import { Link } from 'react-router';

interface MovieDetailProps {
    movie: Movie
}

const isSmallScreen = typeof window !== 'undefined' && window.matchMedia("only screen and (max-width: 760px)").matches;
class FindResult extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    private getSmallPosterSrc(posterUrl: string) {
        return isSmallScreen && posterUrl ? posterUrl.replace('mpost', 'mpost4') : posterUrl;
    }

    render() {
        return (
            <Paper zDepth={2} className="row no-margin" style={{ marginBottom: '.5em' }}>
                <div className="col-xs-3 col-sm-2 no-padding">
                    <Link to={`/movie/${this.props.movie.yahooId}`} >
                        <img className="img-responsive" src={this.getSmallPosterSrc(this.props.movie.posterUrl)} />
                    </Link>
                </div>
                <div className="col-xs-9 col-sm-10" style={{ paddingBottom: '.5em' }}>
                    <div style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                        <Link style={{ color: 'inherit' }} to={`/movie/${this.props.movie.yahooId}`}><b>{this.props.movie.chineseTitle}({this.props.movie.englishTitle})</b></Link>
                        <div className="resultInfo">
                            <span>上映日:{this.props.movie.releaseDate}</span>
                            <span className="hidden-xs">類型:{this.props.movie.type}</span>
                            <span>片長:{this.props.movie.runTime}</span>
                        </div>
                    </div>
                    <Ratings className="resultRatings" movie={this.props.movie}></Ratings>
                    <div className="hidden-xs">
                        <div className="resultSummary" dangerouslySetInnerHTML={{ __html: this.props.movie.briefSummary }}></div>
                        <Link to={`/movie/${this.props.movie.yahooId}`} >繼續閱讀...</Link>
                    </div>
                </div>
            </Paper>
        );
    };
}

export default FindResult;