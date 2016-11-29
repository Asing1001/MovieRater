import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Movie from '../../models/movie';

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
                    <div className="ratings">
                        <div className="ratingWrapper"><img src="public/image/imdb.png" />
                            {this.props.movie.imdbID ? <a target="_blank" href={"http://www.imdb.com/title/" + this.props.movie.imdbID}> {this.props.movie.imdbRating ? this.props.movie.imdbRating : 'N/A'}</a>
                                : <span> {this.props.movie.imdbRating ? this.props.movie.imdbRating : 'N/A'}</span>
                            }
                        </div>
                        <div className="ratingWrapper"><img src="public/image/yahoo.png" />
                            <a target="_blank" href={"https://tw.movies.yahoo.com/movieinfo_main.html/id=" + this.props.movie.yahooId}> {this.props.movie.yahooRating ? this.props.movie.yahooRating : 'N/A'}</a>
                        </div>
                        <div className="ratingWrapper"><img src="public/image/rottentomatoes.png" />
                            {this.props.movie.tomatoURL && this.props.movie.tomatoURL !== 'N/A' ? <a target="_blank" href={this.props.movie.tomatoURL}> {this.props.movie.tomatoRating ? this.props.movie.tomatoRating : 'N/A'}</a>
                                : <span> {this.props.movie.tomatoRating ? this.props.movie.tomatoRating : 'N/A'}</span>
                            }
                        </div>
                        <div className="ratingWrapper"><span className="pttLogo">PTT</span>
                            <span className="hint--bottom" aria-label="(好雷/普雷/負雷)">
                                {this.props.movie.goodRateArticles.length}/{this.props.movie.normalRateArticles.length}/{this.props.movie.badRateArticles.length}
                            </span>
                        </div>
                    </div>

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