"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Tabs_1 = require("material-ui/Tabs");
const react_swipeable_views_1 = require("react-swipeable-views");
const movieDetail_1 = require("./movieDetail");
const pttArticles_1 = require("./pttArticles");
class MovieDetailTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (value) => {
            this.setState({
                slideIndex: value
            });
        };
        this.state = {
            slideIndex: 0
        };
    }
    render() {
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
    }
}
exports.default = MovieDetailTabs;
//# sourceMappingURL=movieDetailTabs.js.map