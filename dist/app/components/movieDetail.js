"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Table_1 = require("material-ui/Table");
var ratings_1 = require("./ratings");
var MovieDetail = (function (_super) {
    __extends(MovieDetail, _super);
    function MovieDetail(props) {
        return _super.call(this, props) || this;
    }
    MovieDetail.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { className: "col-md-8 col-xs-12 pull-right" },
                React.createElement(ratings_1.default, { className: "ratings", movie: this.props.movie }),
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
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.type)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u7247\u9577"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.runTime)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u5C0E\u6F14"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.director)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u6F14\u54E1"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.actor)),
                        React.createElement(Table_1.TableRow, null,
                            React.createElement(Table_1.TableRowColumn, null, "\u767C\u884C\u516C\u53F8"),
                            React.createElement(Table_1.TableRowColumn, null, this.props.movie.launchCompany))))),
            React.createElement("img", { src: this.props.movie.posterUrl, style: { padding: 0 }, className: "col-md-4 col-xs-12", alt: "" })));
    };
    ;
    return MovieDetail;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MovieDetail;
//# sourceMappingURL=movieDetail.js.map