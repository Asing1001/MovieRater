"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Ratings extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: this.props.className, style: this.props.style },
            React.createElement("div", { className: "ratingWrapper" },
                React.createElement("img", { src: "/public/image/imdb.png" }),
                this.props.movie.imdbID ? React.createElement("a", { href: "http://www.imdb.com/title/" + this.props.movie.imdbID }, this.props.movie.imdbRating ? this.props.movie.imdbRating : 'N/A')
                    : React.createElement("span", null, this.props.movie.imdbRating ? this.props.movie.imdbRating : 'N/A')),
            React.createElement("div", { className: "ratingWrapper" },
                React.createElement("img", { src: "/public/image/yahoo.png" }),
                React.createElement("a", { href: "https://tw.movies.yahoo.com/movieinfo_main.html/id=" + this.props.movie.yahooId }, parseInt(this.props.movie.yahooRating) ? this.props.movie.yahooRating : 'N/A')),
            React.createElement("div", { className: "ratingWrapper hide" },
                React.createElement("img", { src: "/public/image/rottentomatoes.png" }),
                this.props.movie.tomatoURL && this.props.movie.tomatoURL !== 'N/A' ? React.createElement("a", { href: this.props.movie.tomatoURL }, this.props.movie.tomatoRating ? this.props.movie.tomatoRating : 'N/A')
                    : React.createElement("span", null, this.props.movie.tomatoRating ? this.props.movie.tomatoRating : 'N/A')),
            React.createElement("div", { className: "ratingWrapper" },
                React.createElement("span", { className: "pttLogo" }, "PTT"),
                React.createElement("span", { className: "hint--bottom", "aria-label": "(好雷/普雷/負雷)" },
                    this.props.movie.goodRateArticles.length,
                    "/",
                    this.props.movie.normalRateArticles.length,
                    "/",
                    this.props.movie.badRateArticles.length))));
    }
    ;
}
exports.default = Ratings;
//# sourceMappingURL=ratings.js.map