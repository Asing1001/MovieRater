"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var List_1 = require("material-ui/List");
var Tabs_1 = require("material-ui/Tabs");
var PttArticles = (function (_super) {
    __extends(PttArticles, _super);
    function PttArticles(props) {
        return _super.call(this, props) || this;
    }
    PttArticles.prototype.getPttPushColor = function (push) {
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
    };
    PttArticles.prototype.getArticleList = function (articleList) {
        var _this = this;
        return articleList.length === 0 ?
            React.createElement("h4", { style: { color: '#aaa', textAlign: "center", paddingTop: '18px' } }, "\u627E\u4E0D\u5230\u76F8\u95DC\u6587\u7AE0") :
            React.createElement(List_1.List, null, articleList.map(function (article) {
                return React.createElement(List_1.ListItem, { innerDivStyle: { paddingLeft: '56px', cursor: 'initial' }, key: article.url, leftAvatar: React.createElement("span", { className: "pttPush", style: { color: _this.getPttPushColor(article.push) } }, article.push), primaryText: React.createElement("a", { target: "_blank", className: "pttArticleTitle", href: 'https://www.ptt.cc' + article.url }, article.title), secondaryText: React.createElement("div", { style: { color: '#aaa', lineHeight: '1em' } }, article.date + ' ' + article.author) });
            }));
    };
    PttArticles.prototype.render = function () {
        return (React.createElement(Tabs_1.Tabs, { className: "pttArticles", inkBarStyle: { background: '#aaa' }, tabItemContainerStyle: { background: 'black' } },
            React.createElement(Tabs_1.Tab, { label: "\u597D\u96F7(" + this.props.movie.goodRateArticles.length + ")" }, this.getArticleList(this.props.movie.goodRateArticles)),
            React.createElement(Tabs_1.Tab, { label: "\u666E\u96F7(" + this.props.movie.normalRateArticles.length + ")" }, this.getArticleList(this.props.movie.normalRateArticles)),
            React.createElement(Tabs_1.Tab, { label: "\u8CA0\u96F7(" + this.props.movie.badRateArticles.length + ")" }, this.getArticleList(this.props.movie.badRateArticles)),
            React.createElement(Tabs_1.Tab, { label: "\u5176\u4ED6(" + this.props.movie.otherArticles.length + ")" }, this.getArticleList(this.props.movie.otherArticles))));
    };
    ;
    return PttArticles;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PttArticles;
//# sourceMappingURL=pttArticles.js.map