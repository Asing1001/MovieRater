"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ratings_1 = require("./ratings");
const react_router_dom_1 = require("react-router-dom");
const isSmallScreen = typeof window !== 'undefined' && window.matchMedia("only screen and (max-width: 760px)").matches;
class MovieCard extends React.Component {
    constructor(props) {
        super(props);
    }
    getSmallPosterSrc(posterUrl) {
        return posterUrl && posterUrl.replace('mpost', isSmallScreen ? 'mpost3' : 'mpost2');
    }
    render() {
        return (React.createElement("article", { style: { display: 'flex' } },
            React.createElement(react_router_dom_1.Link, { to: `/movie/${this.props.movie.yahooId}` },
                React.createElement("img", { src: this.getSmallPosterSrc(this.props.movie.posterUrl) })),
            React.createElement("div", { style: { padding: '0 0 .5em .5em' } },
                React.createElement("header", { style: { paddingTop: '.5em', paddingBottom: '.5em' } },
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
                    React.createElement("p", { className: "resultSummary", dangerouslySetInnerHTML: { __html: this.props.movie.briefSummary } }),
                    React.createElement(react_router_dom_1.Link, { to: `/movie/${this.props.movie.yahooId}` }, "\u7E7C\u7E8C\u95B1\u8B80...")))));
    }
    ;
}
exports.default = MovieCard;
//# sourceMappingURL=movieCard.js.map