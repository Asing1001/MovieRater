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
const theaterCard_1 = require("./theaterCard");
const loadingIcon_1 = require("./loadingIcon");
const helper_1 = require("../helper");
const SelectField_1 = require("material-ui/SelectField");
const MenuItem_1 = require("material-ui/MenuItem");
const react_apollo_1 = require("react-apollo");
const theatersQuery = react_apollo_1.gql `
query theatersQuery{
  theaters {
    name
    address
    url
    phone
    subRegion
    location {
      lat
      lng
    }
  }
}`;
const theaterInfoStyle = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
};
const defaultSubRegion = '全部地區';
let TheaterList = class TheaterList extends React.Component {
    constructor(props) {
        super(props);
        this.componentWillReceiveProps = (nextprops) => {
            const { data: { loading, theaters } } = nextprops;
            if (!loading) {
                this.setState({ theaters }, () => this.setTheatersWithDistance(theaters));
            }
        };
        this.setTheatersWithDistance = (theaters) => {
            helper_1.getClientGeoLocation().then(({ latitude, longitude }) => {
                const theatersWithDistance = theaters.map((theater) => {
                    const { location: { lat, lng } } = theater;
                    return Object.assign({ distance: helper_1.getDistanceInKM(lng, lat, longitude, latitude) }, theater);
                }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
                this.setState({ theaters: theatersWithDistance });
            });
        };
        this.handleChange = (event, index, selectedSubRegion) => this.setState({ selectedSubRegion });
        this.state = {
            theaters: [],
            selectedSubRegion: defaultSubRegion
        };
    }
    render() {
        const { data: { loading } } = this.props;
        if (loading) {
            return React.createElement(loadingIcon_1.default, { isLoading: loading });
        }
        const subRegions = [...new Set(this.props.data.theaters.map(({ subRegion }) => subRegion))];
        return (React.createElement("div", null,
            React.createElement("div", { className: "col-xs-12", style: { padding: '0 1em' } },
                React.createElement(SelectField_1.default, { value: this.state.selectedSubRegion, onChange: this.handleChange },
                    React.createElement(MenuItem_1.default, { value: defaultSubRegion, primaryText: defaultSubRegion }),
                    subRegions.map((subRegion, index) => React.createElement(MenuItem_1.default, { key: index, value: subRegion, primaryText: subRegion })))),
            this.state.theaters.filter(({ subRegion }) => this.state.selectedSubRegion === defaultSubRegion || subRegion === this.state.selectedSubRegion)
                .map((theater, index) => (React.createElement(Paper_1.default, { key: index, zDepth: 2, className: "col-xs-12", style: { padding: ".5em 1em" } },
                React.createElement(theaterCard_1.default, { theater: theater }))))));
    }
};
TheaterList = __decorate([
    react_apollo_1.graphql(theatersQuery),
    __metadata("design:paramtypes", [Object])
], TheaterList);
exports.default = TheaterList;
//# sourceMappingURL=theaterList.js.map