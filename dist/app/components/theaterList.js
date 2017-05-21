"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const sort_1 = require("material-ui/svg-icons/content/sort");
const theaterCard_1 = require("./theaterCard");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const helper_2 = require("../helper");
const SelectField_1 = require("material-ui/SelectField");
const MenuItem_1 = require("material-ui/MenuItem");
const nearbyIcon = React.createElement(sort_1.default, null);
const theaterQuery = `{
  theaters {
    name,
    address,
    url,
    phone,
    subRegion,
    location {
      lat,
      lng,
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
class TheaterList extends React.Component {
    constructor(props) {
        super(props);
        this.getTheatersWithDistance = () => {
            helper_2.getClientGeoLocation().then(({ latitude, longitude }) => {
                const theatersWithDistance = this.state.theaters.map((theater) => {
                    const { location: { lat, lng } } = theater;
                    return Object.assign({ distance: helper_2.getDistanceInKM(lng, lat, longitude, latitude) }, theater);
                }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
                this.setState({ theaters: theatersWithDistance });
            });
        };
        this.handleChange = (event, index, selectedSubRegion) => this.setState({ selectedSubRegion });
        this.state = {
            theaters: [],
            subRegions: [],
            isLoading: true,
            selectedSubRegion: defaultSubRegion
        };
    }
    getData(ids) {
        return helper_1.requestGraphQL(`${theaterQuery}`).then((json) => {
            return this.setState({
                theaters: json.data.theaters,
                subRegions: [...new Set(json.data.theaters.map(({ subRegion }) => subRegion))],
                isLoading: false
            });
        });
    }
    componentDidMount() {
        this.getData(this.props.match.params.ids).then(this.getTheatersWithDistance);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading }),
            React.createElement("div", { className: "col-xs-12" },
                React.createElement(SelectField_1.default, { value: this.state.selectedSubRegion, onChange: this.handleChange },
                    React.createElement(MenuItem_1.default, { value: defaultSubRegion, primaryText: defaultSubRegion }),
                    this.state.subRegions.map((subRegion, index) => React.createElement(MenuItem_1.default, { key: index, value: subRegion, primaryText: subRegion })))),
            this.state.theaters.filter(({ subRegion }) => this.state.selectedSubRegion === defaultSubRegion || subRegion === this.state.selectedSubRegion)
                .map((theater, index) => (React.createElement(theaterCard_1.default, { key: index, theater: theater })))));
    }
}
exports.default = TheaterList;
//# sourceMappingURL=theaterList.js.map