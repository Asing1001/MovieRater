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

    render() {
        return (
            <div>
                <div className="col-md-8 col-xs-12">
                    <List>
                        {this.state.movie.relatedArticles.map(article => {
                            return <ListItem
                                key={article.url}
                                leftAvatar={<span>{article.push}</span>}
                                primaryText={<a target="_blank" href={article.url}>{article.title}</a>}
                                secondaryText={article.date + ' ' + article.author} />
                        })}
                    </List>
                </div>
            </div>
        );
    };
}

export default PttArticles;