"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Schedules extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: "col-xs-12" }, this.props.schedules.map(({ timesStrings, theaterName }) => {
            return (React.createElement("div", { key: theaterName, style: { padding: ".6em 1em 0em 1em" } },
                React.createElement("h5", { style: { marginBottom: ".4em" } }, theaterName),
                timesStrings.map(time => React.createElement("span", { style: { marginRight: "1em", display: "inline-block" }, key: time }, time))));
        })));
    }
    ;
}
exports.default = Schedules;
//# sourceMappingURL=schedules.js.map