import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Movie from '../../models/movie';
import { List, ListItem } from 'material-ui/List';
import { Checkbox } from 'material-ui/Checkbox';

interface MovieDetailProps {
    movie: Movie
}

class PttArticles extends React.Component<MovieDetailProps, null> {
    constructor(props) {
        super(props)
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
            <div className="col-xs-12" style={{ background: 'black', height: '100%' }}>
                {this.props.movie.relatedArticles.length === 0 ?
                    <h4 style={{ color: '#aaa', textAlign: "center" }}>找不到相關文章</h4> :
                    <List>
                        {this.props.movie.relatedArticles.map(article => {
                            return <ListItem
                                innerDivStyle={{ paddingLeft: '56px', background: 'black', cursor: 'initial' }}
                                key={article.url}
                                leftAvatar={<span className="pttPush" style={{ color: this.getPttPushColor(article.push) }}>{article.push}</span>}
                                primaryText={<a target="_blank" className="pttArticleTitle" href={article.url}>{article.title}</a>}
                                secondaryText={<div style={{ color: '#aaa', lineHeight: '1em' }}>{article.date + ' ' + article.author}</div>} />
                        })}
                    </List>
                }
            </div>
        );
    };
}

export default PttArticles;