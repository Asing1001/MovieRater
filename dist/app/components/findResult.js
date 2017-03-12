"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Paper_1 = require('material-ui/Paper');
var ratings_1 = require('./ratings');
var isSmallScreen = typeof window !== 'undefined' && window.matchMedia("only screen and (max-width: 760px)").matches;
var FindResult = (function (_super) {
    __extends(FindResult, _super);
    function FindResult(props) {
        _super.call(this, props);
    }
    FindResult.prototype.getSmallPosterSrc = function (posterUrl) {
        return isSmallScreen && posterUrl ? posterUrl.replace('mpost', 'mpost4') : posterUrl;
    };
    FindResult.prototype.render = function () {
        return (React.createElement(Paper_1.default, {zDepth: 2, className: "row no-margin", style: { marginBottom: '.5em' }}, 
            React.createElement("div", {className: "col-xs-3 col-sm-2 no-padding"}, 
                React.createElement("a", {href: "/movie/" + this.props.movie.yahooId}, 
                    React.createElement("img", {className: "img-responsive", src: this.getSmallPosterSrc(this.props.movie.posterUrl)})
                )
            ), 
            React.createElement("div", {className: "col-xs-9 col-sm-10", style: { paddingBottom: '.5em' }}, 
                React.createElement("div", {style: { paddingTop: '.5em', paddingBottom: '.5em' }}, 
                    React.createElement("a", {style: { color: 'inherit' }, href: "/movie/" + this.props.movie.yahooId}, 
                        React.createElement("b", null, 
                            this.props.movie.chineseTitle, 
                            "(", 
                            this.props.movie.englishTitle, 
                            ")")
                    ), 
                    React.createElement("div", {className: "resultInfo"}, 
                        React.createElement("span", null, 
                            "上映日:", 
                            this.props.movie.releaseDate), 
                        React.createElement("span", {className: "hidden-xs"}, 
                            "類型:", 
                            this.props.movie.type), 
                        React.createElement("span", null, 
                            "片長:", 
                            this.props.movie.runTime))), 
                React.createElement(ratings_1.default, {className: "resultRatings", movie: this.props.movie}), 
                React.createElement("div", {className: "hidden-xs"}, 
                    React.createElement("div", {className: "resultSummary", dangerouslySetInnerHTML: { __html: this.props.movie.briefSummary }}), 
                    React.createElement("a", {href: "/movie/" + this.props.movie.yahooId}, "繼續閱讀...")))));
    };
    ;
    return FindResult;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FindResult;
//# sourceMappingURL=findResult.js.map