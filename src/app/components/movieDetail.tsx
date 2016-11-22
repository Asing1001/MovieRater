import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Movie from '../../models/movie';


interface MovieDetailProps {
    movie: Movie
}

interface MovieDetailState {
    movie: Movie
}

class MovieDetail extends React.Component<MovieDetailProps, MovieDetailState> {
    constructor(props) {
        super(props)
        this.state = {
            movie: new Movie()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.movie !== this.state.movie) {          
            this.setState({ movie: this.classifyArticle(nextProps.movie) });
        }
    }

    private classifyArticle(movie:Movie) {
        if(!movie.relatedArticles) return movie;   
        var [goodRateArticles,normalRateArticles,badRateArticles,otherArticles] = [[],[],[],[]];  
        movie.relatedArticles.forEach((article) => {
            let title = article.title;
            if (title.indexOf('好雷') !== -1 || title.indexOf('好無雷') !== -1) {
                goodRateArticles.push(article);
            } else if (title.indexOf('普雷') !== -1) {
                normalRateArticles.push(article)
            } else if (title.indexOf('負雷') !== -1) {
                badRateArticles.push(article)
            } else {
                otherArticles.push(article);
            }
        });
        movie.goodRateArticles = goodRateArticles; 
        movie.normalRateArticles = normalRateArticles; 
        movie.badRateArticles = badRateArticles; 
        movie.otherArticles = otherArticles; 
        return movie;
    }

    render() {
        if (!this.state.movie.chineseTitle) { return null }
        return (
            <Paper style={{ display: 'table' }} zDepth={2}>
                <div id="movieInfo" className="col-md-8 col-xs-12 pull-right">
                    <div className="ratings">
                        <div className="ratingWrapper"><img src="public/image/imdb.png" />
                            {this.state.movie.imdbID ? <a target="_blank" href={"http://www.imdb.com/title/" + this.state.movie.imdbID}> {this.state.movie.imdbRating ? this.state.movie.imdbRating : 'N/A'}</a>
                                : <span> {this.state.movie.imdbRating ? this.state.movie.imdbRating : 'N/A'}</span>
                            }
                        </div>
                        <div className="ratingWrapper"><img src="public/image/yahoo.png" />
                            <a target="_blank" href={"https://tw.movies.yahoo.com/movieinfo_main.html/id=" + this.state.movie.yahooId}> {this.state.movie.yahooRating ? this.state.movie.yahooRating : 'N/A'}</a>
                        </div>
                        <div className="ratingWrapper"><img src="public/image/rottentomatoes.png" />
                            {this.state.movie.tomatoURL && this.state.movie.tomatoURL !== 'N/A' ? <a target="_blank" href={this.state.movie.tomatoURL}> {this.state.movie.tomatoRating ? this.state.movie.tomatoRating : 'N/A'}</a>
                                : <span> {this.state.movie.tomatoRating ? this.state.movie.tomatoRating : 'N/A'}</span>
                            }
                        </div>
                        <div className="ratingWrapper"><span className="pttLogo">PTT</span>
                            <span className="hint--bottom" aria-label="(好雷/普雷/負雷)">
                                {this.state.movie.goodRateArticles.length}/{this.state.movie.normalRateArticles.length}/{this.state.movie.badRateArticles.length}
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
                <img src={this.state.movie.posterUrl} style={{ padding: 0 }} className="col-md-4 col-xs-12" alt="" />
            </Paper>
        );
    };
}

export default MovieDetail;