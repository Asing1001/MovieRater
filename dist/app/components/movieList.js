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
const sort_1 = require("material-ui/svg-icons/content/sort");
const movieCard_1 = require("./movieCard");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const react_apollo_1 = require("react-apollo");
const nearbyIcon = React.createElement(sort_1.default, null);
const movieListingQuery = react_apollo_1.gql `
         query MovieListing($yahooIds:[Int]){
           movies(yahooIds:$yahooIds) {
            yahooId,
            posterUrl,
            chineseTitle,
            englishTitle,
            releaseDate,
            types,
            runTime,
            yahooRating,
            imdbID,
            imdbRating,
            relatedArticles{title},
            briefSummary
            }
          }`;
let MovieList = class MovieList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            isLoading: true
        };
    }
    render() {
        if (this.props.data.loading) {
            return React.createElement(loadingIcon_1.default, { isLoading: this.props.data.loading });
        }
        return (React.createElement("div", null, this.props.data.movies.map(movie => helper_1.classifyArticle(movie)).sort(this.props.sortFunction).map((movie, index) => (React.createElement(Paper_1.default, { zDepth: 2, className: "row no-margin", style: { marginBottom: '.5em' }, key: index },
            React.createElement(movieCard_1.default, { key: movie.yahooId, movie: movie }))))));
    }
};
MovieList = __decorate([
    react_apollo_1.graphql(movieListingQuery, {
        options: ({ match }) => {
            return {
                variables: {
                    yahooIds: match.params.ids && match.params.ids.split(',').map(id => parseInt(id))
                },
            };
        },
    }),
    __metadata("design:paramtypes", [Object])
], MovieList);
exports.default = MovieList;
//# sourceMappingURL=movieList.js.map