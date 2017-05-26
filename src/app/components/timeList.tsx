import * as React from 'react';
import * as moment from 'moment';
import { red500 } from 'material-ui/styles/colors';

interface TimeListProps {
    timesStrings: String[],
    style?: React.CSSProperties
}

class TimeList extends React.Component<TimeListProps, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        const nearestTimeIndex = this.props.timesStrings.findIndex(time => moment(time, 'hh:mm a') > moment());
        return (
            <div style={this.props.style}>
                {this.props.timesStrings.map((time, index) => {
                    if (index === nearestTimeIndex)
                        return <small style={{ display: "inline-block", width: "66px", color: red500 }} key={index}><strong>{time}</strong></small>
                    else
                        return <small style={{ display: "inline-block", width: "66px", color: 'grey' }} key={index}>{time}</small>
                })}
            </div>
        );
    };
}

export default TimeList;