"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const moment = require("moment");
class TimeList extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const now = moment();
        const nearestTimeIndex = this.props.timesStrings.findIndex(time => moment(time, 'hh:mm a') > now);
        return (React.createElement("div", { style: this.props.style }, this.props.timesStrings.map((time, index) => {
            if (nearestTimeIndex !== -1 && index >= nearestTimeIndex)
                return React.createElement("small", { style: { display: "inline-block", width: "66px" }, key: index },
                    React.createElement("strong", null, time));
            else
                return React.createElement("small", { style: { display: "inline-block", width: "66px", color: 'grey' }, key: index }, time);
        })));
    }
    ;
}
exports.default = TimeList;
//# sourceMappingURL=timeList.js.map