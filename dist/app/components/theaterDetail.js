"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Paper_1 = require("material-ui/Paper");
const sort_1 = require("material-ui/svg-icons/content/sort");
const findResult_1 = require("./findResult");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const theaterCard_1 = require("./theaterCard");
const nearbyIcon = React.createElement(sort_1.default, null);
const theaterQuery = `{
    name,
    address,
    url,
    phone,
    subRegion,
    location {
      lat,
      lng,
    },
    schedules {
        movie {
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            runTime,
            director,
            actor,
            imdbID,
            yahooRating,
            imdbRating,
            relatedArticles {
            title
         }
       },
        timesValues,
        timesStrings,
        roomTypes,
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
class TheaterDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            theater: {
                schedules: []
            }
        };
    }
    getData(name) {
        this.setState({ isLoading: true });
        fetch(`/graphql?query={theaters(name:"${name}")${theaterQuery.replace(/\s+/g, "")}}`).then(res => {
            return res.json();
        })
            .then((json) => {
            this.setState({ theater: json.data.theaters[0], isLoading: false });
        });
    }
    componentWillReceiveProps(nextProps) {
        this.getData(nextProps.match.params.name);
    }
    componentDidMount() {
        this.getData(this.props.match.params.name);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading }),
            React.createElement(theaterCard_1.default, { theater: this.state.theater }),
            this.state.theater.schedules && this.state.theater.schedules.map((schedule, index) => (React.createElement(Paper_1.default, { zDepth: 2, key: index, className: "row no-margin", style: { marginBottom: '.5em' } },
                React.createElement("div", null,
                    React.createElement(findResult_1.default, { movie: helper_1.classifyArticle(schedule.movie) })),
                React.createElement("div", { className: "col-xs-12", style: { color: 'grey' } }, schedule.timesStrings.map(time => React.createElement("span", { style: { marginRight: "1em", display: "inline-block" }, key: time }, time))))))));
    }
}
exports.default = TheaterDetail;
//# sourceMappingURL=theaterDetail.js.map