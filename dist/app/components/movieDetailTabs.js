"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Tabs_1 = require("material-ui/Tabs");
var react_swipeable_views_1 = require("react-swipeable-views");
var movieDetail_1 = require("./movieDetail");
var pttArticles_1 = require("./pttArticles");
var MovieDetailTabs = (function (_super) {
    __extends(MovieDetailTabs, _super);
    function MovieDetailTabs(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (value) {
            _this.setState({
                slideIndex: value
            });
        };
        _this.state = {
            slideIndex: 0
        };
        return _this;
    }
    MovieDetailTabs.prototype.render = function () {
        if (!this.props.movie.chineseTitle) {
            return null;
        }
        return (React.createElement("div", null,
            React.createElement(Tabs_1.Tabs, { onChange: this.handleChange, value: this.state.slideIndex },
                React.createElement(Tabs_1.Tab, { label: "Detail", value: 0 }),
                React.createElement(Tabs_1.Tab, { label: "Ptt", value: 1 }),
                React.createElement(Tabs_1.Tab, { label: "Summary", value: 2 })),
            React.createElement(react_swipeable_views_1.default, { index: this.state.slideIndex, onChangeIndex: this.handleChange },
                React.createElement("div", { style: { height: this.state.slideIndex === 0 ? 'auto' : 0 } },
                    React.createElement(movieDetail_1.default, { movie: this.props.movie })),
                React.createElement("div", { style: { height: this.state.slideIndex === 1 ? 'auto' : 0 } },
                    React.createElement(pttArticles_1.default, { movie: this.props.movie })),
                React.createElement("div", { className: "col-xs-12", style: { paddingTop: '1em', height: this.state.slideIndex === 2 ? 'auto' : 0 }, dangerouslySetInnerHTML: { __html: this.props.movie.summary } }))));
    };
    return MovieDetailTabs;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MovieDetailTabs;
//# sourceMappingURL=movieDetailTabs.js.map