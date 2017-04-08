"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Paper_1 = require("material-ui/Paper");
const ratings_1 = require("./ratings");
const isSmallScreen = typeof window !== 'undefined' && window.matchMedia("only screen and (max-width: 760px)").matches;
class FindResult extends React.Component {
    constructor(props) {
        super(props);
    }
    getSmallPosterSrc(posterUrl) {
        return isSmallScreen && posterUrl ? posterUrl.replace('mpost', 'mpost4') : posterUrl;
    }
    render() {
        return (React.createElement(Paper_1.default, { zDepth: 2, className: "row no-margin", style: { marginBottom: '.5em' } },
            React.createElement("div", { className: "col-xs-3 col-sm-2 no-padding" },
                React.createElement("a", { href: `/movie/${this.props.movie.yahooId}` },
                    React.createElement("img", { className: "img-responsive", src: this.getSmallPosterSrc(this.props.movie.posterUrl) }))),
            React.createElement("div", { className: "col-xs-9 col-sm-10", style: { paddingBottom: '.5em' } },
                React.createElement("div", { style: { paddingTop: '.5em', paddingBottom: '.5em' } },
                    React.createElement("a", { style: { color: 'inherit' }, href: `/movie/${this.props.movie.yahooId}` },
                        React.createElement("b", null,
                            this.props.movie.chineseTitle,
                            "(",
                            this.props.movie.englishTitle,
                            ")")),
                    React.createElement("div", { className: "resultInfo" },
                        React.createElement("span", null,
                            "\u4E0A\u6620\u65E5:",
                            this.props.movie.releaseDate),
                        React.createElement("span", { className: "hidden-xs" },
                            "\u985E\u578B:",
                            this.props.movie.type),
                        React.createElement("span", null,
                            "\u7247\u9577:",
                            this.props.movie.runTime))),
                React.createElement(ratings_1.default, { className: "resultRatings", movie: this.props.movie }),
                React.createElement("div", { className: "hidden-xs" },
                    React.createElement("div", { className: "resultSummary", dangerouslySetInnerHTML: { __html: this.props.movie.briefSummary } }),
                    React.createElement("a", { href: `/movie/${this.props.movie.yahooId}` }, "\u7E7C\u7E8C\u95B1\u8B80...")))));
    }
    ;
}
exports.default = FindResult;
//# sourceMappingURL=findResult.js.map