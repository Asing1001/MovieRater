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
const moment = require("moment");
const Paper_1 = require("material-ui/Paper");
const Chip_1 = require("material-ui/Chip");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const theaterCard_1 = require("./theaterCard");
const movieCard_1 = require("./movieCard");
const react_apollo_1 = require("react-apollo");
const colors_1 = require("material-ui/styles/colors");
const theaterDetailQuery = react_apollo_1.gql `
query TheaterDetail($theaterName:String){
    theaters(name:$theaterName){
        name
        address
        url
        phone
        subRegion
        location {
            lat
            lng
        }
        schedules {
            date
            movie {
                yahooId
                posterUrl
                chineseTitle
                englishTitle
                releaseDate
                runTime
                directors
                actors
                imdbID
                yahooRating
                imdbRating
                types
                relatedArticles {
                    title
                }
            }
            timesValues
            timesStrings
            roomTypes
        }
    }
}`;
var SortType;
(function (SortType) {
    SortType[SortType["imdb"] = 0] = "imdb";
    SortType[SortType["yahoo"] = 1] = "yahoo";
    SortType[SortType["tomato"] = 2] = "tomato";
    SortType[SortType["ptt"] = 3] = "ptt";
    SortType[SortType["releaseDate"] = 4] = "releaseDate";
})(SortType || (SortType = {}));
let TheaterDetail = class TheaterDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.componentWillReceiveProps = (nextprops) => {
            const { data: { loading, theaters } } = nextprops;
            if (!loading && theaters.length) {
                const availableDates = this.getAvailableDates(theaters[0].schedules);
                const newestAvailableDate = availableDates.find(date => moment(date).isSameOrAfter(moment(), 'date'));
                this.setState({ availableDates, selectedDate: newestAvailableDate || availableDates[0] });
            }
        };
        this.state = {
            selectedDate: null,
            availableDates: []
        };
    }
    getAvailableDates(schedules) {
        return [...new Set(schedules.map(({ date }) => date))];
    }
    render() {
        const { data: { loading, theaters } } = this.props;
        if (loading) {
            return React.createElement(loadingIcon_1.default, { isLoading: loading });
        }
        let theater = theaters[0];
        document.title = `上映場次時刻表 - ${theater.name} | Movie Rater`;
        return (React.createElement("div", null,
            React.createElement(Paper_1.default, { zDepth: 2, style: { marginBottom: '.5em', padding: ".5em 1em" } },
                React.createElement(theaterCard_1.default, { theater: theater }),
                React.createElement("div", { className: "date-wrapper" }, this.state.availableDates
                    .map((date, index) => React.createElement(Chip_1.default, { className: "datebtn", backgroundColor: this.state.selectedDate === date ? colors_1.grey500 : null, key: index, onClick: () => this.setState(Object.assign({}, this.state, { selectedDate: date })) }, moment(date).format('MM/DD'))))),
            theater.schedules && theater.schedules.slice()
                .filter(({ date }) => date === this.state.selectedDate)
                .sort(({ movie }, { movie: movie2 }) => this.props.sortFunction(helper_1.classifyArticle(movie), helper_1.classifyArticle(movie2)))
                .map((schedule, index) => (React.createElement(Paper_1.default, { zDepth: 2, key: index, className: "row no-margin", style: { marginBottom: '.5em' } },
                React.createElement(movieCard_1.default, { movie: helper_1.classifyArticle(schedule.movie), timesStrings: schedule.timesStrings, roomTypes: schedule.roomTypes }))))));
    }
};
TheaterDetail = __decorate([
    react_apollo_1.graphql(theaterDetailQuery, {
        options: ({ match }) => {
            return {
                variables: {
                    theaterName: decodeURI(match.params.name)
                }
            };
        },
    }),
    __metadata("design:paramtypes", [Object])
], TheaterDetail);
exports.default = TheaterDetail;
//# sourceMappingURL=theaterDetail.js.map