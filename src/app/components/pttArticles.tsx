import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Movie from '../../models/movie';
import { List, ListItem } from 'material-ui/List';


interface MovieDetailProps {
    movie: Movie
}

interface MovieDetailState {
    movie: Movie
}

class PttArticles extends React.Component<MovieDetailProps, MovieDetailState> {
    constructor(props) {
        super(props)
        this.state = {
            movie: props.movie
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.movie !== this.state.movie) {
            this.setState({ movie: nextProps.movie });
        }
    }

    private getPttPushColor(push: string) {
        if (!push) {
            return '';
        } else if (push === '爆') {
            return '#f66';
        } else if (push.toLowerCase().startsWith('x')) {
            return '#666';
        } else if (parseInt(push) < 10) {
            return '#6f6';
        } else {
            return '#ff6';
        }
    }

    render() {
        return (
            <div>
                <div className="col-md-8 col-xs-12">
                    <List>
                        {this.state.movie.relatedArticles.map(article => {
                            return <ListItem
                                innerDivStyle={{ paddingLeft: '56px', background: 'black' }}
                                key={article.url}
                                leftAvatar={<span className="pttPush" style={{ color: this.getPttPushColor(article.push) }}>{article.push}</span>}
                                primaryText={<a target="_blank" className="pttArticleTitle" href={article.url}>{article.title}</a>}
                                secondaryText={<div style={{ color: '#aaa' }}>{article.date + ' ' + article.author}</div>} />
                        })}
                    </List>
                </div>
            </div>
        );
    };
}

export default PttArticles;