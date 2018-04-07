import RefreshIndicator from 'material-ui/RefreshIndicator';
import * as React from 'react';


export default class LoadingIcon extends React.PureComponent<any, null> {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <RefreshIndicator
                size={40}
                left={-20}
                top={150}
                status={this.props.isLoading ? "loading" : "hide"}
                style={{ marginLeft: '50%', zIndex: 3 }}
            />
        )
    }
}
