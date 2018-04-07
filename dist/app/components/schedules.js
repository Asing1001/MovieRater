"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const moment = require("moment");
const helper_1 = require("../helper");
const theaterCard_1 = require("./theaterCard");
const timeList_1 = require("./timeList");
const Chip_1 = require("material-ui/Chip");
const theaterInfoStyle = {
    marginRight: '0.5em',
    fontSize: 'small',
    alignItems: 'center',
    display: 'inline-flex'
};
class Schedules extends React.PureComponent {
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
    setSchedulesWithDistance(schedules) {
        helper_1.getClientGeoLocation().then(({ latitude, longitude }) => {
            const schedulesWithDistance = schedules.map((schedule) => {
                let { theaterExtension, theaterExtension: { location: { lat, lng } } } = schedule;
                theaterExtension.distance = helper_1.getDistanceInKM(lng, lat, longitude, latitude);
                return Object.assign({}, schedule, { theaterExtension });
            }).sort(({ theaterExtension: { distance: distanceA } }, { theaterExtension: { distance: distanceB } }) => distanceA - distanceB);
            this.setState({ schedulesWithDistance });
        });
    }
    componentDidMount() {
        let schedules = this.props.schedules.slice().sort(({ theaterExtension: { regionIndex: a } }, { theaterExtension: { regionIndex: b } }) => a - b);
        this.setState({ schedulesWithDistance: schedules }, () => this.setSchedulesWithDistance(schedules));
    }
    render() {
        return (React.createElement("div", { className: "col-xs-12" },
            React.createElement("div", { className: "date-wrapper col-xs-12" }, this.getAvailableDates()
                .map((date, index) => React.createElement(Chip_1.default, { className: "datebtn", key: index, onClick: () => this.setState({ selectedDate: date }) }, index === 0 ? "今天" : moment(date).format('MM/DD')))),
            this.state.schedulesWithDistance.filter(({ date }) => date === this.state.selectedDate).map(({ timesStrings, theaterName, roomTypes, distance, theaterExtension }, index) => {
                return (React.createElement("p", { key: index, className: "col-xs-12" },
                    React.createElement(theaterCard_1.default, { theater: theaterExtension, roomTypes: roomTypes }),
                    React.createElement(timeList_1.default, { timesStrings: timesStrings })));
            })));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map