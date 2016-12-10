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
                <div className="col-md-2 hidden-xs no-padding">
                    <img src={this.props.movie.posterUrl} alt="" className="img-responsive" />
                </div>
                <div className="col-xs-12 col-md-10" style={{ paddingBottom: '1em' }}>
                    <h5>{this.props.movie.chineseTitle}({this.props.movie.englishTitle})</h5>
                    <Ratings movie={this.props.movie}></Ratings>
                </div>
            </Paper>
        );
    };
}

export default FindResult;