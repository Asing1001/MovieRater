"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const sort_1 = require("material-ui/svg-icons/content/sort");
const loadingIcon_1 = require("./loadingIcon");
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
            title,
            push,
            url,
            date,
            author,
         }
       }
        timesValues,
        timesStrings   ,
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
        this.getData(nextProps.params.name);
    }
    componentDidMount() {
        this.getData(this.props.params.name);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading }),
            this.state.theater.schedules && this.state.theater.schedules.map((schedule) => (React.createElement("div", null, JSON.stringify(schedule))))));
    }
}
exports.default = TheaterDetail;
//# sourceMappingURL=theaterDetail.js.map