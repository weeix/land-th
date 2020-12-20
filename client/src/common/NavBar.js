import React, { Component } from "react";
import {
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  AddCircleOutline as AddCircleOutlineIcon,
  AddLocation as AddLocationIcon,
  List as ListIcon,
  Menu as MenuIcon,
  PlaylistAdd as PlaylistAddIcon
} from '@material-ui/icons'
import {
  Link as RouterLink
} from "react-router-dom";
import "./NavBar.css";

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpened: false
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  openDrawer() {
    this.setState({
      drawerOpened: true
    });
  }

  closeDrawer() {
    this.setState({
      drawerOpened: false
    });
  }

  render() {
    const menu = (
      <nav>
        <List>
          <ListItem button component={RouterLink} to="/">
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="รูปแปลงทั้งหมด" />
          </ListItem>
          <ListItem button component={RouterLink} to="/addland">
            <ListItemIcon>
              <AddLocationIcon />
            </ListItemIcon>
            <ListItemText primary="เพิ่มรูปแปลง" />
          </ListItem>
          <ListItem button component={RouterLink} to="/addlandtype">
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="เพิ่มชนิดรูปแปลง" />
          </ListItem>
          <Divider />
          <ListItem button  component={RouterLink} to="/addlanduse">
            <ListItemIcon>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="เพิ่มการใช้ประโยชน์รูปแปลง" />
          </ListItem>
          <ListItem button component={RouterLink} to="/addlandusetype">
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary="เพิ่มชนิดการใช้ประโยชน์รูปแปลง" />
          </ListItem>
        </List>
      </nav>
    )
    return (
      <React.Fragment>
        <AppBar position="fixed" className="app-bar" >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={this.openDrawer}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" id="title">
              LandTH
            </Typography>
            <Typography id="eth-address">
              {this.props.displayName}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden smUp implementation="js">
          <Drawer
            anchor="left"
            open={this.state.drawerOpened}
            onClick={this.closeDrawer}
            onClose={this.closeDrawer}
            className="drawer"
            classes={{
              paper: "drawer-paper"
            }}
          >
            {menu}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="js">
          <Drawer
            anchor="left"
            variant="permanent"
            className="drawer"
            classes={{
              paper: "drawer-paper"
            }}
          >
            {menu}
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

export default NavBar;
