import * as React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Movie from '../../models/movie';
import Article from '../../models/article';
import { List, ListItem } from 'material-ui/List';
import { Checkbox } from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
interface MovieDetailProps {
    movie: Movie
}

enum ArticleType {
    GoodRate, badRate, normalRate, other
}

class PttArticles extends React.Component<MovieDetailProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            filteredArticles: [],
            goodRateToggle: true,
            badRateToggle: true,
            normalRateToggle: true,
            otherToggle: true
        }
    }

    componentWillReceiveProps(nextProps: MovieDetailProps) {
        if (this.props !== nextProps) {
            this.getFilterdArticles();
        }
    }

    private toggleGoodRate(){
        this.setState({goodRateToggle:!this.state.goodRateToggle})
        this.getFilterdArticles();
    }

    private handleToggle(articleType : ArticleType){
        // switch(articleType){
        //     case ArticleType.GoodRate:
        //         this.setState({goodRateToggle:!this.state.goodRateToggle})
        // }
        // alert(articleType)
        //this.getFilterdArticles();
        return null;
    }

    private getFilterdArticles() {
        let movie = this.props.movie;
        let filteredArticles = [].concat(this.state.goodRateToggle ? movie.goodRateArticles : [],
            this.state.badRateToggle ? movie.badRateArticles : [],
            this.state.normalRateToggle ? movie.normalRateArticles : [],
            this.state.otherToggle ? movie.otherArticles : [])
        this.setState({ filteredArticles: filteredArticles });
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
                <Toggle
                    label="GoodRate" style={{ color: 'white'}} toggled={this.state.goodRateToggle} onToggle={this.toggleGoodRate.bind(this)}
                    />
                {this.state.goodRateToggle}
                {this.state.filteredArticles.length === 0 ?
                    <h4 style={{ color: '#aaa', textAlign: "center" }}>找不到相關文章</h4> :
                    <List>
                        {this.state.filteredArticles.map(article => {
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