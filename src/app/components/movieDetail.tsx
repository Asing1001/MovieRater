import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';

class MovieDetail extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = { movie: {} };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.movie !== this.state.movie) {
            this.setState({ movie: nextProps.movie });
        }
    }

    render() {
        return (
          <Paper style={{ display: 'table' }} zDepth={2}>
            <img src={this.state.movie.posterUrl} style={{ padding: 0 }} className="col-lg-6 col-xs-12" alt="" />
            <div className="col-lg-6 col-xs-12">
              <CardText>
                <img src="public/image/imdb.png" /> {this.state.movie.imdbRating} <img src="public/image/yahoo.png" /> {this.state.movie.rating} <img src="public/image/rottentomatoes.png" />{this.state.movie.tomatoRating}
              </CardText>
               <Table>
                <TableBody
                    displayRowCheckbox={false}>
                    <TableRow>
                        <TableRowColumn>中文名稱</TableRowColumn>
                        <TableRowColumn>{this.state.movie.chineseTitle}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>英文名稱</TableRowColumn>
                        <TableRowColumn>{this.state.movie.englishTitle}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>上映日期</TableRowColumn>
                        <TableRowColumn>{this.state.movie.releaseDate}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>類型</TableRowColumn>
                        <TableRowColumn>{this.state.movie.type}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>片長</TableRowColumn>
                        <TableRowColumn>{this.state.movie.runTime}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>導演</TableRowColumn>
                        <TableRowColumn>{this.state.movie.director}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>演員</TableRowColumn>
                        <TableRowColumn>{this.state.movie.actor}</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn>發行公司</TableRowColumn>
                        <TableRowColumn>{this.state.movie.launchCompany}</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
            </div>
          </Paper>
        );
    };
}

export default MovieDetail;