"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const helper_1 = require("../helper");
const location_on_1 = require("material-ui/svg-icons/communication/location-on");
const call_1 = require("material-ui/svg-icons/communication/call");
const colors_1 = require("material-ui/styles/colors");
class Schedules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schedulesWithDistance: this.props.schedules,
        };
    }
    getSchedulesWithDistance() {
        helper_1.getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = this.props.schedules.map((schedule) => {
                const { theaterExtension: { location: { lat, lng } } } = schedule;
                return Object.assign({ distance: helper_1.getDistanceInKM(lng, lat, longitude, latitude) }, schedule);
            }).sort(({ distance: distanceA }, { distance: distanceB }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance });
        });
    }
    componentWillMount() {
        this.getSchedulesWithDistance();
    }
    render() {
        return (React.createElement("div", { className: "col-xs-12" }, this.state.schedulesWithDistance.map(({ timesStrings, theaterName, distance, theaterExtension: { phone } }) => {
            return (React.createElement("div", { key: theaterName, style: { padding: ".6em 1em 0em 1em" } },
                React.createElement("h5", { style: { marginBottom: "-.2em", fontSize: "16px" } }, theaterName),
                React.createElement("a", { href: `tel:${phone}`, style: { marginRight: '0.5em', marginTop: '0.5em', fontSize: 'small', alignItems: 'center', display: 'inline-flex' } },
                    React.createElement(call_1.default, { color: colors_1.grey500, viewBox: '0 0 30 24' }),
                    phone),
                distance &&
                    (React.createElement("a", { href: `https://maps.google.com?q=${theaterName}`, style: { fontSize: 'small', alignItems: 'center', display: 'inline-flex' } },
                        React.createElement(location_on_1.default, { color: colors_1.grey500, viewBox: '-3 0 30 24' }),
                        distance,
                        " km")),
                React.createElement("div", { style: { color: 'grey' } }, timesStrings.map(time => React.createElement("span", { style: { marginRight: "1em", display: "inline-block" }, key: time }, time)))));
        })));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map