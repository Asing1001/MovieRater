"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const status_1 = require("./status");
class PageNotFound extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(status_1.default, { code: 404 },
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    height: '150px',
                } },
                React.createElement("h4", null, `404 Page not found`))));
    }
}
exports.default = PageNotFound;
//# sourceMappingURL=pageNotFound.js.map