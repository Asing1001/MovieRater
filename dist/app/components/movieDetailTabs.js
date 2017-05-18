"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Tabs_1 = require("material-ui/Tabs");
const react_swipeable_views_1 = require("react-swipeable-views");
const Paper_1 = require("material-ui/Paper");
const movieDetail_1 = require("./movieDetail");
const pttArticles_1 = require("./pttArticles");
const schedules_1 = require("./schedules");
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
            schedules {
              theaterName,
              timesStrings,
              roomTypes,
              theaterExtension {
                phone,
                region,
                regionIndex,
                location {
                  lat,
                  lng,
                }
              }
            }
          }`;
class MovieDetailTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (value) => {
            this.setState({
                slideIndex: value,
            });
        };
        this.handleSlideHeight = () => {
            const slides = document.querySelectorAll("[role='option']");
            Array.from(slides).forEach((slide, index) => {
                slide.style.height = index === this.state.slideIndex ? 'auto' : '500px';
            });
        };
        this.componentDidUpdate = (prevProps, prevState) => {
            this.handleSlideHeight();
        };
        this.state = {
            movie: {},
            slideIndex: 0,
            isLoading: true
        };
    }
    componentDidMount() {
        this.search([parseInt(this.props.match.params.id)]);
    }
    componentWillReceiveProps(nextProps) {
        this.search([parseInt(nextProps.match.params.id)]);
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
        return this.state.isLoading ? React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading }) :
            (React.createElement(Paper_1.default, { zDepth: 2 },
                React.createElement(Tabs_1.Tabs, { onChange: this.handleChange.bind(this), value: this.state.slideIndex },
                    React.createElement(Tabs_1.Tab, { label: "Detail", value: 0 }),
                    React.createElement(Tabs_1.Tab, { label: "Ptt", value: 1 }),
                    React.createElement(Tabs_1.Tab, { label: "Summary", value: 2 }),
                    this.state.movie.schedules.length > 0 && React.createElement(Tabs_1.Tab, { label: "Time", value: 3 })),
                React.createElement("div", { className: "swipeViewWrapper" },
                    React.createElement(react_swipeable_views_1.default, { slideStyle: { height: '500px', paddingBottom: '1em' }, index: this.state.slideIndex, onChangeIndex: this.handleChange.bind(this), threshold: 6 },
                        React.createElement(movieDetail_1.default, { movie: this.state.movie }),
                        React.createElement(pttArticles_1.default, { movie: this.state.movie }),
                        React.createElement("div", { className: "col-xs-12", style: { paddingTop: '1em' }, dangerouslySetInnerHTML: { __html: this.state.movie.summary } }),
                        React.createElement(schedules_1.default, { schedules: this.state.movie.schedules })))));
    }
}
exports.default = MovieDetailTabs;
//# sourceMappingURL=movieDetailTabs.js.map