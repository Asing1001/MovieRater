import * as React from 'react';
import Movie from '../../models/movie';
import Article from '../../models/article';
import { List, ListItem } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';

interface MovieDetailProps {
    movie: Movie
}

class PttArticles extends React.PureComponent<MovieDetailProps, null> {
    constructor(props) {
        super(props);
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

    private getArticleList(articleList) {
        return articleList.length === 0 ?
            <h4 style={{ color: '#aaa', textAlign: "center", paddingTop: '18px' }}>找不到相關文章</h4> :
            <List>
                {articleList.map((article: Article, index) => {
                    return <ListItem
                        innerDivStyle={{ paddingLeft: '56px', cursor: 'initial' }}
                        key={index}
                        leftAvatar={<span className="pttPush" style={{ color: this.getPttPushColor(article.push) }}>{article.push}</span>}
                        primaryText={<a target="_blank" className="pttArticleTitle" href={'https://www.ptt.cc' + article.url}>{article.title}</a>}
                        secondaryText={<div style={{ color: '#aaa', lineHeight: '1em' }}>{article.date + ' ' + article.author}</div>} />
                })}
            </List>
    }

    render() {
        return (
            <Tabs className="pttArticles" inkBarStyle={{ background: '#aaa' }} tabItemContainerStyle={{ background: 'black' }}>
                <Tab label={`好雷(${this.props.movie.goodRateArticles.length})`}>
                    {this.getArticleList(this.props.movie.goodRateArticles)}
                </Tab>
                <Tab label={`普雷(${this.props.movie.normalRateArticles.length})`}>
                    {this.getArticleList(this.props.movie.normalRateArticles)}
                </Tab>
                <Tab label={`負雷(${this.props.movie.badRateArticles.length})`}>
                    {this.getArticleList(this.props.movie.badRateArticles)}
                </Tab>
                <Tab label={`其他(${this.props.movie.otherArticles.length})`}>
                    {this.getArticleList(this.props.movie.otherArticles)}
                </Tab>
            </Tabs>
        );
    };
}

export default PttArticles;