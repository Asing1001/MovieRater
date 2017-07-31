import * as React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import SVGAvMovie from 'material-ui/svg-icons/av/movie';
import SVGActionTheaters from 'material-ui/svg-icons/action/theaters';
import { List, ListItem } from 'material-ui/List';

class AppDrawer extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        };
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    toggle = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        return (
            <Drawer
                docked={false}
                width={300}
                containerStyle={{ maxWidth: '75%' }}
                open={this.state.open}
                onRequestChange={(open) => this.setState({ open })}
            >
                <List>
                    <Link to="/"><ListItem onTouchTap={() => this.handleClose()} leftIcon={<SVGAvMovie />}>現正上映</ListItem></Link>
                    <Link to="/upcoming"><ListItem onTouchTap={() => this.handleClose()} leftIcon={<SVGAvMovie />}>即將上映</ListItem></Link>
                    {/* <Link to="/theaters"><ListItem onTouchTap={() => this.handleClose()} leftIcon={<SVGActionTheaters />}>戲院總覽</ListItem>                   </Link> */}
                </List>
            </Drawer>
        );
    }
}
export default AppDrawer;