import * as React from 'react';
import { Route } from 'react-router-dom';
import { StaticRouterProps } from "react-router";

interface StatusProps {
    code: number
}

class Status extends React.Component<StatusProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return <Route render={(routerProps) => {
            const staticContext = routerProps["staticContext"];
            if (staticContext) {
                staticContext.status = this.props.code;
            }
            return this.props.children
        }} />
    }
}

export default Status;