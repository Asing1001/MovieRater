import * as React from 'react';
import Status from './status';

class PageNotFound extends React.Component<any, any> {
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
                        {`404 Page not found`}
                    </h4>
                </div>
            </Status>
        );
    }
}
export default PageNotFound;