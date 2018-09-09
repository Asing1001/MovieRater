"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const share_1 = require("material-ui/svg-icons/social/share");
const IconButton_1 = require("material-ui/IconButton");
const Table_1 = require("material-ui/Table");
const ratings_1 = require("./ratings");
const helper_1 = require("../helper");
class MovieDetail extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    share() {
        navigator["share"]({
            title: document.title,
            text: document["meta"].description,
            url: location.href,
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }
    render() {
        const schema = helper_1.getMovieSchema(this.props.movie);
        return (React.createElement("div", null,
            React.createElement("script", { type: "application/ld+json" }, JSON.stringify(schema)),
            React.createElement("div", { className: "col-md-8 col-xs-12 pull-right" },
                React.createElement(ratings_1.default, { className: "ratings", movie: this.props.movie }, navigator['share'] && React.createElement(IconButton_1.default, { style: { position: 'absolute', top: '3px', right: 0 }, onTouchTap: e => { e.preventDefault(); this.share(); } },
                    React.createElement(share_1.default, { color: "#9E9E9E" }))),
                React.createElement(Table_1.Table, { className: "movieDetail", selectable: false },
                    React.createElement(Table_1.TableBody, { displayRowCheckbox: false },
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u4E2D\u6587\u540D\u7A31"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.chineseTitle)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u82F1\u6587\u540D\u7A31"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.englishTitle)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u4E0A\u6620\u65E5\u671F"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.releaseDate)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u985E\u578B"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.types.join('、'))),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u7247\u9577"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.runTime)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u5C0E\u6F14"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.directors.join('、'))),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u6F14\u54E1"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.actors.join('、'))),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u767C\u884C\u516C\u53F8"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.launchCompany))))),
            React.createElement("img", { src: this.props.movie.posterUrl, style: { padding: 0 }, className: "col-md-4 col-xs-12", alt: "" })));
    }
    ;
}
exports.default = MovieDetail;
//# sourceMappingURL=movieDetail.js.map