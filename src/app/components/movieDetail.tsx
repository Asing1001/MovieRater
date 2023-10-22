import * as React from 'react';
import SVGSocialShare from 'material-ui/svg-icons/social/share';
import IconButton from 'material-ui/IconButton';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import Movie from '../../models/movie';
import Ratings from './ratings';
import { getMovieSchema } from '../helper';

interface MovieDetailProps {
    movie: Movie
}

function getBigPosterUrl(linePosterUrl: string): string {
    if (!linePosterUrl) {
        return ''
    }
    return linePosterUrl.replace('/w280', '/w644')
}
class MovieDetail extends React.PureComponent<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    share() {
        navigator["share"]({
            title: document.title,
            text: `${this.props.movie.chineseTitle} ${this.props.movie.englishTitle} | ${document["meta"].description} | MovieRater`,
            url: location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }

    render() {
        const schema = JSON.stringify(getMovieSchema(this.props.movie))

        return (
            <div>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html:schema}}></script>
                <div className="col-md-8 col-xs-12 pull-right">
                    <Ratings className="ratings" movie={this.props.movie}>
                        {navigator['share'] && <IconButton style={{ position: 'absolute', top: '3px', right: 0 }} onTouchTap={e => { e.preventDefault(); this.share() }}><SVGSocialShare color={"#9E9E9E"} /></IconButton>}
                    </Ratings>
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
                                <TableRowColumn>{this.props.movie.types.join('、')}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>片長</TableRowColumn>
                                <TableRowColumn>{this.props.movie.runTime}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>導演</TableRowColumn>
                                <TableRowColumn>{this.props.movie.directors.join('、')}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>演員</TableRowColumn>
                                <TableRowColumn>{this.props.movie.actors.join('、')}</TableRowColumn>
                            </TableRow>
                            <TableRow>
                                <TableRowColumn>發行公司</TableRowColumn>
                                <TableRowColumn>{this.props.movie.launchCompany}</TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <img src={getBigPosterUrl(this.props.movie.posterUrl)} style={{ padding: 0 }} className="col-md-4 col-xs-12" alt="" />
            </div>
        );
    };
}

export default MovieDetail;