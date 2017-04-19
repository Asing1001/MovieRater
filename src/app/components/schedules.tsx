import * as React from 'react';
import Schedule from '../../models/schedule';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
interface MovieDetailProps {
    schedules: Schedule[]
}

class Schedules extends React.Component<MovieDetailProps, {}> {
    constructor(props) {
        super(props)
    }

    getSchedules() {
        return this.props.schedules.map(({ timesStrings, theaterName }) => {
                return (
                    <div key={theaterName} className="col-xs-12">
                        <h4>{theaterName}</h4>
                        {timesStrings.map(time => <Chip style={{ display: 'inline-block' }} key={time}>{time}</Chip>)}
                    </div>
                )
            })
    }

    render() {
        return (
            <div>
                {
                    this.getSchedules()
                }
            </div>
        );
    };
}

export default Schedules;