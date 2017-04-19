import * as React from 'react';
import Schedule from '../../models/schedule';
import { Link } from 'react-router';
import Chip from 'material-ui/Chip';

interface MovieDetailProps {
    schedules: Schedule[]
}

class Schedules extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="col-xs-12">
                {this.props.schedules.map(({ timesStrings, theaterName }) => {
                    return (
                        <div key={theaterName} style={{padding:".6em 1em 0em 1em"}}>
                            <h5 style={{marginBottom:".4em"}}>{theaterName}</h5>
                            {timesStrings.map(time => <span style={{marginRight:"1em",display:"inline-block"}} key={time}>{time}</span>)}
                        </div>
                    )
                })}
            </div>
        );
    };
}

export default Schedules;