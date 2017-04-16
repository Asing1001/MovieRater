"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Tabs_1 = require("material-ui/Tabs");
const react_swipeable_views_1 = require("react-swipeable-views");
const Paper_1 = require("material-ui/Paper");
const movieDetail_1 = require("./movieDetail");
const pttArticles_1 = require("./pttArticles");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const ALLDATA = `{
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            type,
            runTime,
            director,
            actor,
            launchCompany,
            companyUrl,
            yahooRating,
            imdbID,
            imdbRating,
            tomatoURL            ,
            tomatoRating,
            relatedArticles{title,push,url,date,author},
            summary,
          }`;
class MovieDetailTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (value) => {
            this.setState({
                slideIndex: value,
            });
        };
        this.state = {
            movie: {},
            slideIndex: 0,
            isLoading: true
        };
    }
    componentWillMount() {
        this.search([parseInt(this.props.params.id)]);
    }
    componentWillReceiveProps(nextProps) {
        this.search([parseInt(nextProps.params.id)]);
    }
    search(yahooIds) {
        this.setState({ isLoading: true });
        helper_1.requestGraphQL(`
        {
          movies(yahooIds:${JSON.stringify(yahooIds)})${ALLDATA}
        }
    `)
            .then((json) => {
            this.setState({
                movie: json.data.movies.map(movie => helper_1.classifyArticle(movie))[0],
                isLoading: false,
            });
        });
    }
    render() {
        if (!this.state.movie.chineseTitle) {
            return React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading });
        }
        return (React.createElement(Paper_1.default, { zDepth: 2 },
            React.createElement(Tabs_1.Tabs, { onChange: this.handleChange, value: this.state.slideIndex },
                React.createElement(Tabs_1.Tab, { label: "Detail", value: 0 }),
                React.createElement(Tabs_1.Tab, { label: "Ptt", value: 1 }),
                React.createElement(Tabs_1.Tab, { label: "Summary", value: 2 })),
            React.createElement(react_swipeable_views_1.default, { index: this.state.slideIndex, onChangeIndex: this.handleChange },
                React.createElement("div", { style: { height: this.state.slideIndex === 0 ? 'auto' : 0 } },
                    React.createElement(movieDetail_1.default, { movie: this.state.movie })),
                React.createElement("div", { style: { height: this.state.slideIndex === 1 ? 'auto' : 0 } },
                    React.createElement(pttArticles_1.default, { movie: this.state.movie })),
                React.createElement("div", { className: "col-xs-12", style: { paddingTop: '1em', height: this.state.slideIndex === 2 ? 'auto' : 0 }, dangerouslySetInnerHTML: { __html: this.state.movie.summary } }))));
    }
}
exports.default = MovieDetailTabs;
//# sourceMappingURL=movieDetailTabs.js.map