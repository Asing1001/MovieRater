"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AutoComplete_1 = require("material-ui/AutoComplete");
class AppAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
    }
    clearSearchText() {
        this.setState({ searchText: '' });
        document.querySelector('input').focus();
    }
    handleUpdateInput(text) { this.setState({ searchText: text }); }
    render() {
        return (React.createElement(AutoComplete_1.default, { className: "autoComplete", hintText: React.createElement("span", null, "\u641C\u5C0B\u96FB\u5F71\u540D\u7A31(\u4E2D\u82F1\u7686\u53EF)"), dataSource: this.props.dataSource, filter: AutoComplete_1.default.caseInsensitiveFilter, maxSearchResults: 6, onNewRequest: this.props.onNewRequest.bind(this), searchText: this.state.searchText, onUpdateInput: this.handleUpdateInput.bind(this), menuStyle: { minWidth: '500px' }, style: { height: '36px', width: "auto" }, textFieldStyle: { position: 'absolute', height: "36px" }, textareaStyle: { top: "7px" } }));
    }
}
exports.default = AppAutoComplete;
//# sourceMappingURL=appAutoComplete.js.map