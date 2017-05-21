"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const helper_1 = require("../helper");
const theaterCard_1 = require("./theaterCard");
const theaterInfoStyle = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
};
class Schedules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schedulesWithDistance: []
        };
    }
    getSchedulesWithDistance() {
        let schedulesCopy = JSON.parse(JSON.stringify(this.props.schedules));
        helper_1.getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = schedulesCopy.map((schedule) => {
                let { theaterExtension, theaterExtension: { location: { lat, lng } } } = schedule;
                theaterExtension.distance = helper_1.getDistanceInKM(lng, lat, longitude, latitude);
                return Object.assign(schedule, { theaterExtension });
            }).sort(({ theaterExtension: { distance: distanceA } }, { theaterExtension: { distance: distanceB } }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance });
        }, () => {
            schedulesCopy.sort(({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) => a - b);
            this.setState({ schedulesWithDistance: schedulesCopy });
        });
    }
    componentDidMount() {
        this.getSchedulesWithDistance();
    }
    render() {
        return (React.createElement("div", { className: "col-xs-12" }, this.state.schedulesWithDistance.map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension }, index) => {
            return (React.createElement("div", { key: index, style: { padding: ".6em 1em 0em 1em" } },
                React.createElement(theaterCard_1.default, { theater: theaterExtension, roomTypes: roomTypes }),
                React.createElement("div", { style: { color: 'grey' } }, timesStrings.map(time => React.createElement("span", { style: { marginRight: "1em", display: "inline-block" }, key: time }, time)))));
        })));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map