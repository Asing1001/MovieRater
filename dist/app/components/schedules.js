"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const helper_1 = require("../helper");
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
                React.createElement("h5", { style: { marginBottom: "-.2em", fontSize: "16px" } },
                    theaterName,
                    distance && (React.createElement("span", null,
                        " - ",
                        React.createElement("a", { href: `https://maps.google.com?q=${theaterName}`, style: { fontSize: 'small' } },
                            distance,
                            " km")))),
                React.createElement("a", { style: { marginLeft: "1px", fontSize: 'small' }, href: `tel:${phone}` }, phone),
                React.createElement("p", null, timesStrings.map(time => React.createElement("span", { style: { marginRight: "1em", display: "inline-block" }, key: time }, time)))));
        })));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map