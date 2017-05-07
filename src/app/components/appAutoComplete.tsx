import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import SVGContentClear from 'material-ui/svg-icons/content/clear';

class AppAutoComplete extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            searchText: ''
        };
    }

    private clearSearchText() {
        this.setState({ searchText: '' });
        document.querySelector('input').focus();
    }

    private handleUpdateInput(text) { this.setState({ searchText: text }) }

    render() {
        return (
            <AutoComplete
                className="autoComplete"
                hintText={<span>搜尋電影名稱(中英皆可)</span>}
                dataSource={this.props.dataSource}
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={6}
                onNewRequest={this.props.onNewRequest.bind(this)}
                searchText={this.state.searchText}
                onUpdateInput={this.handleUpdateInput.bind(this)}
                menuStyle={{ minWidth: '500px' }}
                style={{ height: '36px', width: "auto" }}
                textFieldStyle={{ position: 'absolute', height: "36px" }}
                textareaStyle={{ top: "7px" }}
            />
        );
    }
}
export default AppAutoComplete;