"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MovieNotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(nextProps) {
        // this.getData(nextProps.params.ids);
    }
    render() {
        return (React.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                height: '150px',
            } },
            React.createElement("h4", null, `資料庫還沒有${this.props.params.query}的相關資料唷！`)));
    }
}
exports.default = MovieNotFound;
//# sourceMappingURL=movieNotFound.js.map