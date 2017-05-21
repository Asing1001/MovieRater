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
const Paper_1 = require("material-ui/Paper");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const theaterCard_1 = require("./theaterCard");
const findResult_1 = require("./findResult");
const react_apollo_1 = require("react-apollo");
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
            movie {
                yahooId
                posterUrl
                chineseTitle
                englishTitle
                releaseDate
                runTime
                director
                actor
                imdbID
                yahooRating
                imdbRating
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
let TheaterDetail = class TheaterDetail extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data: { loading, theaters } } = this.props;
        if (loading) {
            return React.createElement(loadingIcon_1.default, { isLoading: loading });
        }
        let theater = theaters[0];
        return (React.createElement("div", null,
            React.createElement(Paper_1.default, { zDepth: 2, style: { marginBottom: '.5em', padding: ".5em 1em" } },
                React.createElement(theaterCard_1.default, { theater: theater })),
            theater.schedules && theater.schedules.map((schedule, index) => (React.createElement(Paper_1.default, { zDepth: 2, key: index, className: "row no-margin", style: { marginBottom: '.5em' } },
                React.createElement("div", null,
                    React.createElement(findResult_1.default, { movie: helper_1.classifyArticle(schedule.movie) })),
                React.createElement("div", { className: "col-xs-9", style: { color: 'grey' } }, schedule.timesStrings.map(time => React.createElement("span", { style: { marginRight: "1em", display: "inline-block" }, key: time }, time))))))));
    }
};
TheaterDetail = __decorate([
    react_apollo_1.graphql(theaterDetailQuery, {
        options: ({ match }) => {
            return {
                variables: {
                    theaterName: match.params.name
                }
            };
        },
    }),
    __metadata("design:paramtypes", [Object])
], TheaterDetail);
exports.default = TheaterDetail;
//# sourceMappingURL=theaterDetail.js.map