import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Movie from '../../models/movie';
import Ratings from './ratings';

interface MovieDetailProps {
    movie: Movie
}

class MovieDetail extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="col-md-8 col-xs-12 pull-right">                    
                    <Ratings className="ratings" movie={this.props.movie}></Ratings>                    
                    <Table className="movieDetail"
                        selectable={false}
                        >
                        <TableBody
                            displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn>中文名稱</TableRowColumn>
                                <TableRowColumn>{this.props.movie.chineseTitle}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>英文名稱</TableRowColumn>
                                <TableRowColumn>{this.props.movie.englishTitle}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>上映日期</TableRowColumn>
                                <TableRowColumn>{this.props.movie.releaseDate}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>類型</TableRowColumn>
                                <TableRowColumn>{this.props.movie.type}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>片長</TableRowColumn>
                                <TableRowColumn>{this.props.movie.runTime}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>導演</TableRowColumn>
                                <TableRowColumn>{this.props.movie.director}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>演員</TableRowColumn>
                                <TableRowColumn>{this.props.movie.actor}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>發行公司</TableRowColumn>
                                <TableRowColumn>{this.props.movie.launchCompany}</TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <img src={this.props.movie.posterUrl} style={{ padding: 0 }} className="col-md-4 col-xs-12" alt="" />
            </div>
        );
    };
}

export default MovieDetail;