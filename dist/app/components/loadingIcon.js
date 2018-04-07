"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RefreshIndicator_1 = require("material-ui/RefreshIndicator");
const React = require("react");
class LoadingIcon extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(RefreshIndicator_1.default, { size: 40, left: -20, top: 150, status: this.props.isLoading ? "loading" : "hide", style: { marginLeft: '50%', zIndex: 3 } }));
    }
}
exports.default = LoadingIcon;
//# sourceMappingURL=loadingIcon.js.map