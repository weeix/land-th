import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core';
import "./NavBar.css";

class NavBar extends Component {
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" id="title">
            LandTH
          </Typography>
          <Typography>
            {this.props.displayName}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
