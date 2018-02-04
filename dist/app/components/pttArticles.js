"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const Tabs_1 = require("material-ui/Tabs");
class PttArticles extends React.Component {
    constructor(props) {
        super(props);
    }
    getPttPushColor(push) {
        if (!push) {
            return '';
        }
        else if (push === '爆') {
            return '#f66';
        }
        else if (push.toLowerCase().startsWith('x')) {
            return '#666';
        }
        else if (parseInt(push) < 10) {
            return '#6f6';
        }
        else {
            return '#ff6';
        }
    }
    getArticleList(articleList) {
        return articleList.length === 0 ?
            React.createElement("h4", { style: { color: '#aaa', textAlign: "center", paddingTop: '18px' } }, "\u627E\u4E0D\u5230\u76F8\u95DC\u6587\u7AE0") :
            React.createElement(List_1.List, null, articleList.map((article, index) => {
                return React.createElement(List_1.ListItem, { innerDivStyle: { paddingLeft: '56px', cursor: 'initial' }, key: index, leftAvatar: React.createElement("span", { className: "pttPush", style: { color: this.getPttPushColor(article.push) } }, article.push), primaryText: React.createElement("a", { target: "_blank", className: "pttArticleTitle", href: 'https://www.ptt.cc' + article.url }, article.title), secondaryText: React.createElement("div", { style: { color: '#aaa', lineHeight: '1em' } }, article.date + ' ' + article.author) });
            }));
    }
    render() {
        return (React.createElement(Tabs_1.Tabs, { className: "pttArticles", inkBarStyle: { background: '#aaa' }, tabItemContainerStyle: { background: 'black' } },
            React.createElement(Tabs_1.Tab, { label: `好雷(${this.props.movie.goodRateArticles.length})` }, this.getArticleList(this.props.movie.goodRateArticles)),
            React.createElement(Tabs_1.Tab, { label: `普雷(${this.props.movie.normalRateArticles.length})` }, this.getArticleList(this.props.movie.normalRateArticles)),
            React.createElement(Tabs_1.Tab, { label: `負雷(${this.props.movie.badRateArticles.length})` }, this.getArticleList(this.props.movie.badRateArticles)),
            React.createElement(Tabs_1.Tab, { label: `其他(${this.props.movie.otherArticles.length})` }, this.getArticleList(this.props.movie.otherArticles))));
    }
    ;
}
exports.default = PttArticles;
//# sourceMappingURL=pttArticles.js.map