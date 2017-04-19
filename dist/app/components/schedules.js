"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Chip_1 = require("material-ui/Chip");
class Schedules extends React.Component {
    constructor(props) {
        super(props);
    }
    getSchedules() {
        return this.props.schedules.map(({ timesStrings, theaterName }) => {
            return (React.createElement("div", { key: theaterName, className: "col-xs-12" },
                React.createElement("h4", null, theaterName),
                timesStrings.map(time => React.createElement(Chip_1.default, { style: { display: 'inline-block' }, key: time }, time))));
        });
    }
    render() {
        return (React.createElement("div", null, this.getSchedules()));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map