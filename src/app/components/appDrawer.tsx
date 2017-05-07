import * as React from 'react';
import { browserHistory } from 'react-router';
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
        browserHistory.push(`/`);
    };
    
    toggle = () =>{
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
                    <ListItem onTouchTap={this.handleClose.bind(this)} leftIcon={<SVGAvMovie />}>現正上映</ListItem>
                    <ListItem onTouchTap={this.handleClose.bind(this)} leftIcon={<SVGActionTheaters />}>戲院總覽</ListItem>
                </List>
            </Drawer>
        );
    }
}
export default AppDrawer;