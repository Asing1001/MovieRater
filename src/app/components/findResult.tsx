import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';

interface MovieDetailProps {
    movie: Movie
    showDetail: Function
}

const isSmallScreen = window.matchMedia("only screen and (max-width: 760px)").matches;
class FindResult extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    private getSmallPosterSrc(posterUrl: string) {
        return isSmallScreen ? posterUrl.replace('mpost', 'mpost2') : posterUrl;
    }

    private showDetail(e) {
        e.preventDefault();
        this.props.showDetail(this.props.movie);
    }

    render() {
        return (
            <Paper zDepth={2} className="row no-margin" style={{ marginBottom: '.5em' }}>
                <div className="col-xs-3 col-sm-2 no-padding">
                    <img className="pointer img-responsive" onClick={this.showDetail.bind(this)} src={this.getSmallPosterSrc(this.props.movie.posterUrl)} />
                </div>
                <div className="col-xs-9 col-sm-10" style={{ paddingBottom: '.5em' }}>
                    <div className="pointer" onClick={this.showDetail.bind(this)} style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                        <b>{this.props.movie.chineseTitle}({this.props.movie.englishTitle})</b>
                        <div className="resultInfo">
                            <span>上映日:{this.props.movie.releaseDate}</span>
                            <span className="hidden-xs">類型:{this.props.movie.type}</span>
                            <span>片長:{this.props.movie.runTime}</span>
                        </div>
                    </div>
                    <Ratings className="resultRatings" movie={this.props.movie}></Ratings>
                    <div className="hidden-xs">
                        <div className="resultSummary" dangerouslySetInnerHTML={{ __html: this.props.movie.summary }}></div>
                        <a href="" className="pointer" onClick={this.showDetail.bind(this)}>繼續閱讀...</a>
                    </div>
                </div>
            </Paper>
        );
    };
}

export default FindResult;