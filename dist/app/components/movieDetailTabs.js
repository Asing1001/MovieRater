"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const react_apollo_1 = require("react-apollo");
const movieDetailQuery = react_apollo_1.gql `
 query MovieListing($yahooIds:[Int]){
  movies(yahooIds:$yahooIds) {
    yahooId
    posterUrl
    chineseTitle
    englishTitle
    releaseDate
    type
    runTime
    director
    actor
    launchCompany
    companyUrl
    yahooRating
    imdbID
    imdbRating
    tomatoURL            
    tomatoRating
    relatedArticles{
      title
      push
      url
      date
      author
    }
    summary
    schedules {              
      timesStrings
      roomTypes
      theaterExtension {
        name
        phone
        region
        regionIndex
        location {
          lat
          lng
        }
      }
    }
  }
}`;
let MovieDetailTabs = class MovieDetailTabs extends React.Component {
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
            slideIndex: 0,
        };
    }
    render() {
        const { data: { loading, movies } } = this.props;
        if (loading) {
            return React.createElement(loadingIcon_1.default, { isLoading: loading });
        }
        const movie = helper_1.classifyArticle(movies[0]);
        return React.createElement(Paper_1.default, { zDepth: 2 },
            React.createElement(Tabs_1.Tabs, { onChange: this.handleChange.bind(this), value: this.state.slideIndex },
                React.createElement(Tabs_1.Tab, { label: "Detail", value: 0 }),
                React.createElement(Tabs_1.Tab, { label: "Ptt", value: 1 }),
                React.createElement(Tabs_1.Tab, { label: "Summary", value: 2 }),
                movie.schedules.length > 0 && React.createElement(Tabs_1.Tab, { label: "Time", value: 3 })),
            React.createElement("div", { className: "swipeViewWrapper" },
                React.createElement(react_swipeable_views_1.default, { slideStyle: { height: '500px', paddingBottom: '1em' }, index: this.state.slideIndex, onChangeIndex: this.handleChange.bind(this), threshold: 6 },
                    React.createElement(movieDetail_1.default, { movie: movie }),
                    React.createElement(pttArticles_1.default, { movie: movie }),
                    React.createElement("div", { className: "col-xs-12", style: { paddingTop: '1em' }, dangerouslySetInnerHTML: { __html: movie.summary } }),
                    React.createElement(schedules_1.default, { schedules: movie.schedules }))));
    }
};
MovieDetailTabs = __decorate([
    react_apollo_1.graphql(movieDetailQuery, {
        options: ({ match }) => {
            return {
                variables: {
                    yahooIds: match.params.id
                }
            };
        },
    }),
    __metadata("design:paramtypes", [Object])
], MovieDetailTabs);
exports.default = MovieDetailTabs;
//# sourceMappingURL=movieDetailTabs.js.map