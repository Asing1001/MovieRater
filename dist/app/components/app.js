"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
class App extends React.Component {
    constructor(props) {
        super(props);
        this.muiTheme = getMuiTheme_1.default({
            userAgent: navigator.userAgent,
        });
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, { muiTheme: this.muiTheme }, this.props.children));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map