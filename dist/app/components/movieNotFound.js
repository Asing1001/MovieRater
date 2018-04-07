"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const status_1 = require("./status");
class MovieNotFound extends React.PureComponent {
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
                React.createElement("h4", null, `資料庫還沒有${this.props.match.params.query}的相關資料唷！`))));
    }
}
exports.default = MovieNotFound;
//# sourceMappingURL=movieNotFound.js.map