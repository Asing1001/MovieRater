import * as React from 'react';
import Paper from 'material-ui/Paper';
import Status from './status';

class MovieNotFound extends React.PureComponent<any, any> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Status code={404}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    justifyContent: 'center',
                    height: '150px',
                }}>
                    <h4>
                        {`資料庫還沒有${this.props.match.params.query}的相關資料唷！`}
                    </h4>
                </div>
            </Status>
        );
    }
}
export default MovieNotFound;