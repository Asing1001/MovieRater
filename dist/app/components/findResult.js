"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ratings_1 = require("./ratings");
const react_router_dom_1 = require("react-router-dom");
const isSmallScreen = typeof window !== 'undefined' && window.matchMedia("only screen and (max-width: 760px)").matches;
class FindResult extends React.Component {
    constructor(props) {
        super(props);
    }
    getSmallPosterSrc(posterUrl) {
        return isSmallScreen && posterUrl ? posterUrl.replace('mpost', 'mpost3') : posterUrl;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { className: "col-xs-3 col-sm-2 no-padding" },
                React.createElement(react_router_dom_1.Link, { to: `/movie/${this.props.movie.yahooId}` },
                    React.createElement("img", { className: "img-responsive", src: this.getSmallPosterSrc(this.props.movie.posterUrl) }))),
            React.createElement("div", { className: "col-xs-9 col-sm-10", style: { paddingBottom: '.5em' } },
                React.createElement("div", { style: { paddingTop: '.5em', paddingBottom: '.5em' } },
                    React.createElement(react_router_dom_1.Link, { style: { color: 'inherit' }, to: `/movie/${this.props.movie.yahooId}` },
                        React.createElement("b", null, this.props.movie.chineseTitle),
                        React.createElement("br", null),
                        React.createElement("small", null, this.props.movie.englishTitle),
                        " "),
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
                this.props.movie.briefSummary && React.createElement("div", { className: "hidden-xs" },
                    React.createElement("div", { className: "resultSummary", dangerouslySetInnerHTML: { __html: this.props.movie.briefSummary } }),
                    React.createElement(react_router_dom_1.Link, { to: `/movie/${this.props.movie.yahooId}` }, "\u7E7C\u7E8C\u95B1\u8B80...")))));
    }
    ;
}
exports.default = FindResult;
//# sourceMappingURL=findResult.js.map