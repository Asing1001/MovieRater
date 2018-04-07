"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
class Status extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(react_router_dom_1.Route, { render: (routerProps) => {
                const staticContext = routerProps["staticContext"];
                if (staticContext) {
                    staticContext.status = this.props.code;
                }
                return this.props.children;
            } });
    }
}
exports.default = Status;
//# sourceMappingURL=status.js.map