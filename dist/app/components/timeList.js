"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const moment = require("moment");
const colors_1 = require("material-ui/styles/colors");
class TimeList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const nearestTimeIndex = this.props.timesStrings.findIndex(time => moment(time, 'hh:mm a') > moment());
        return (React.createElement("div", { style: this.props.style }, this.props.timesStrings.map((time, index) => {
            if (index === nearestTimeIndex)
                return React.createElement("small", { style: { display: "inline-block", width: "66px", color: colors_1.red500 }, key: index },
                    React.createElement("strong", null, time));
            else
                return React.createElement("small", { style: { display: "inline-block", width: "66px", color: 'grey' }, key: index }, time);
        })));
    }
    ;
}
exports.default = TimeList;
//# sourceMappingURL=timeList.js.map