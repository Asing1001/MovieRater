import * as React from 'react';
import Paper from 'material-ui/Paper';

class MovieNotFound extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
        };
    }

    componentWillReceiveProps(nextProps) {
        // this.getData(nextProps.params.ids);
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                height: '150px',
            }}>
                <h4>
                    {`資料庫還沒有${this.props.params.query}的相關資料唷！`}
                </h4>
            </div>
        );
    }
}
export default MovieNotFound;