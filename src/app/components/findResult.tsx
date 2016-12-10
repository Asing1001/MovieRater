import * as React from 'react';
import Movie from '../../models/movie';
import Paper from 'material-ui/Paper';
import Ratings from './ratings';

interface MovieDetailProps {
    movie: Movie
}

class FindResult extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Paper zDepth={2} className="row no-margin" style={{ marginTop: '.5em' }}>
                <div className="col-xs-2 no-padding">
                    <img src={this.props.movie.posterUrl} alt="" className="img-responsive" style={{minWidth:'60px'}}/>
                </div>
                <div className="col-xs-10" style={{ paddingBottom: '.5em' }}>
                    <div style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
                        <b>{this.props.movie.chineseTitle}({this.props.movie.englishTitle})</b>
                        <div>
                            <span style={{ paddingRight: '1em' }}>上映日: {this.props.movie.releaseDate}</span>
                            <span className="hidden-xs" style={{ paddingRight: '1em' }}>類型: {this.props.movie.type}</span>
                            <span>片長: {this.props.movie.runTime}</span>
                        </div>
                    </div>
                    <Ratings movie={this.props.movie}></Ratings>
                    <div className="hidden-xs">
                        <div className="resultSummary" dangerouslySetInnerHTML={{ __html: this.props.movie.summary }}></div>
                        <a href="">continue reading...</a>
                    </div>
                </div>
            </Paper>
        );
    };
}

export default FindResult;