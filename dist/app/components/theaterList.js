"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Paper_1 = require("material-ui/Paper");
const sort_1 = require("material-ui/svg-icons/content/sort");
const helper_1 = require("../helper");
const loadingIcon_1 = require("./loadingIcon");
const helper_2 = require("../helper");
const react_router_1 = require("react-router");
const location_on_1 = require("material-ui/svg-icons/communication/location-on");
const call_1 = require("material-ui/svg-icons/communication/call");
const colors_1 = require("material-ui/styles/colors");
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
        this.getData(this.props.params.ids).then(this.getTheatersWithDistance);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(loadingIcon_1.default, { isLoading: this.state.isLoading }),
            React.createElement("div", { className: "col-xs-12" },
                React.createElement(SelectField_1.default, { value: this.state.selectedSubRegion, onChange: this.handleChange },
                    React.createElement(MenuItem_1.default, { value: defaultSubRegion, primaryText: defaultSubRegion }),
                    this.state.subRegions.map((subRegion, index) => React.createElement(MenuItem_1.default, { key: index, value: subRegion, primaryText: subRegion })))),
            this.state.theaters.filter(({ subRegion }) => this.state.selectedSubRegion === defaultSubRegion || subRegion === this.state.selectedSubRegion)
                .map(({ name, address, phone, distance }, index) => (React.createElement(Paper_1.default, { zDepth: 2, className: "col-xs-12", style: { paddingBottom: '.5em' }, key: index },
                React.createElement("div", { style: { paddingTop: '.5em', paddingBottom: '.5em' } },
                    React.createElement(react_router_1.Link, { style: { color: 'inherit' }, to: `/theater/${name}` },
                        React.createElement("h5", { style: { marginBottom: "-.2em", fontSize: "16px" } }, name)),
                    React.createElement("div", { style: { paddingTop: '0.5em', display: 'flex', alignItems: 'center' } },
                        React.createElement("a", { href: `tel:${phone}`, style: Object.assign({ whiteSpace: 'nowrap' }, theaterInfoStyle) },
                            React.createElement(call_1.default, { color: colors_1.grey500, viewBox: '0 0 30 24' }),
                            phone),
                        React.createElement("a", { href: `https://maps.google.com?q=${name}`, style: theaterInfoStyle },
                            React.createElement(location_on_1.default, { color: colors_1.grey500, viewBox: '-3 0 30 24' }),
                            address,
                            " ",
                            distance && ` (${distance} km)`))))))));
    }
}
exports.default = TheaterList;
//# sourceMappingURL=theaterList.js.map