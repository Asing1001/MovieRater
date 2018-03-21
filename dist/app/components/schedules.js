"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const helper_1 = require("../helper");
const theaterCard_1 = require("./theaterCard");
const timeList_1 = require("./timeList");
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
            schedulesWithDistance: [],
            selectedDate: this.getAvailableDates()[0]
        };
    }
    getAvailableDates() {
        return [...new Set(this.props.schedules.map(({ date }) => date))];
    }
    setSchedulesWithDistance(schedulesCopy) {
        helper_1.getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = schedulesCopy.map((schedule) => {
                let { theaterExtension, theaterExtension: { location: { lat, lng } } } = schedule;
                theaterExtension.distance = helper_1.getDistanceInKM(lng, lat, longitude, latitude);
                return Object.assign(schedule, { theaterExtension });
            }).sort(({ theaterExtension: { distance: distanceA } }, { theaterExtension: { distance: distanceB } }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance });
        });
    }
    componentDidMount() {
        let schedulesCopy = JSON.parse(JSON.stringify(this.props.schedules));
        schedulesCopy.sort(({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) => a - b);
        this.setState({ schedulesWithDistance: schedulesCopy }, () => this.setSchedulesWithDistance(schedulesCopy));
    }
    render() {
        return (React.createElement("div", { className: "col-xs-12" },
            this.getAvailableDates().map(date => React.createElement("button", { onClick: () => this.setState({ selectedDate: date }) }, date)),
            this.state.schedulesWithDistance.filter(({ date }) => date === this.state.selectedDate).map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension }, index) => {
                return (React.createElement("div", { key: index, style: { padding: ".6em 1em 0em 1em" } },
                    React.createElement(theaterCard_1.default, { theater: theaterExtension, roomTypes: roomTypes }),
                    React.createElement(timeList_1.default, { timesStrings: timesStrings })));
            })));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map