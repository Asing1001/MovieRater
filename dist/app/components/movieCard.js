"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ratings_1 = require("./ratings");
const react_router_dom_1 = require("react-router-dom");
const timeList_1 = require("./timeList");
class MovieCard extends React.Component {
    constructor(props) {
        super(props);
    }
    getSmallPosterSrc(posterUrl) {
        return posterUrl && posterUrl.replace('mpost', 'mpost3');
    }
    render() {
        return (React.createElement("article", { style: { display: 'flex' } },
            React.createElement(react_router_dom_1.Link, { to: `/movie/${this.props.movie.yahooId}` },
                React.createElement("img", { src: this.getSmallPosterSrc(this.props.movie.posterUrl) })),
            React.createElement("div", { className: "col-xs-12" },
                React.createElement("header", { style: { paddingTop: '.5em' } },
                    React.createElement(react_router_dom_1.Link, { style: { color: 'inherit' }, to: `/movie/${this.props.movie.yahooId}` },
                        React.createElement("strong", { style: { display: 'block', lineHeight: '1em' } }, this.props.movie.chineseTitle),
                        React.createElement("small", null, this.props.movie.englishTitle))),
                React.createElement("div", { className: "resultInfo" },
                    React.createElement("span", null,
                        "\u4E0A\u6620\u65E5:",
                        this.props.movie.releaseDate),
                    React.createElement("span", { className: "hidden-xs" },
                        "\u985E\u578B:",
                        this.props.movie.type),
                    React.createElement("span", null,
                        "\u7247\u9577:",
                        this.props.movie.runTime)),
                React.createElement(ratings_1.default, { className: "resultRatings", style: { marginTop: ".3em", marginBottom: ".3em" }, movie: this.props.movie }),
                this.props.timesStrings && React.createElement(timeList_1.default, { timesStrings: this.props.timesStrings }))));
    }
    ;
}
exports.default = MovieCard;
//# sourceMappingURL=movieCard.js.map