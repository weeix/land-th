import React, { Component } from "react";
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  AccountCircle,
  AddCircleOutline as AddCircleOutlineIcon,
  AddLocation as AddLocationIcon,
  ExpandMore,
  List as ListIcon,
  Menu as MenuIcon,
  PersonAdd,
  PlaylistAdd as PlaylistAddIcon,
  Translate
} from '@material-ui/icons'
import {
  Link as RouterLink
} from "react-router-dom";
import { withTranslation } from 'react-i18next';
import "./NavBar.css";

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpened: false,
      menuAnchorEl: null,
      languageAnchorEl: null,
      languages: {
        en: { nativeName: 'English' },
        th: { nativeName: 'ภาษาไทย' }
      },
      currentLanguage: { nativeName: '' }
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openLngMenu = this.openLngMenu.bind(this);
    this.closeLngMenu = this.closeLngMenu.bind(this);
    this.changeLng = this.changeLng.bind(this);
  }

  componentDidMount() {
    const { i18n } = this.props;
    this.setState({
      currentLanguage: this.state.languages[i18n.language]
    });
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

  openMenu(event) {
    this.setState({ menuAnchorEl: event.currentTarget });
  }

  closeMenu() {
    this.setState({ menuAnchorEl: null });
  }

  openLngMenu(event) {
    this.setState({ languageAnchorEl: event.currentTarget });
  }

  closeLngMenu() {
    this.setState({ languageAnchorEl: null });
  }

  changeLng(lng) {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
    this.setState({ currentLanguage: this.state.languages[lng] });
    this.closeLngMenu();
  }

  render() {
    const { t, officer } = this.props;

    let menuForAdmin = null;
    if (officer && officer.orgAdmin) {
      menuForAdmin = (
        <React.Fragment>
          <Divider />
          <ListItem button component={RouterLink} to="/addofficer">
            <ListItemIcon>
              <PersonAdd />
            </ListItemIcon>
            <ListItemText primary={t('addOfficer')} />
          </ListItem>
        </React.Fragment>
      )
    }

    const menu = (
      <nav>
        <List>
          <ListItem button component={RouterLink} to="/">
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary={t('allAllocations')} />
          </ListItem>
          <ListItem button component={RouterLink} to="/addland">
            <ListItemIcon>
              <AddLocationIcon />
            </ListItemIcon>
            <ListItemText primary={t('newAllocation')} />
          </ListItem>
          <ListItem button component={RouterLink} to="/addlandtype">
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary={t('addAllocationType')} />
          </ListItem>
          <Divider />
          <ListItem button  component={RouterLink} to="/addlanduse">
            <ListItemIcon>
              <AddCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={t('newActivity')} />
          </ListItem>
          <ListItem button component={RouterLink} to="/addlandusetype">
            <ListItemIcon>
              <PlaylistAddIcon />
            </ListItemIcon>
            <ListItemText primary={t('addActivityType')} />
          </ListItem>
          {menuForAdmin}
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
            <Button
                aria-label="change language"
                aria-controls="language-appbar"
                aria-haspopup="true"
                color="inherit"
                startIcon={<Translate />}
                endIcon={<ExpandMore />}
                onClick={this.openLngMenu}
            >
              <Typography>
                {this.state.currentLanguage.nativeName}
              </Typography>
            </Button>
            <Menu
              id="language-appbar"
              anchorEl={this.state.languageAnchorEl}
              keepMounted
              open={Boolean(this.state.languageAnchorEl)}
              onClose={this.closeLngMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {Object.keys(this.state.languages).map(lng => (
                <MenuItem key={lng} onClick={() => this.changeLng(lng)}>
                  {this.state.languages[lng].nativeName}
                </MenuItem>
              ))}
            </Menu>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={this.openMenu}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={this.state.menuAnchorEl}
              keepMounted
              open={Boolean(this.state.menuAnchorEl)}
              onClose={this.closeMenu}
            >
              <MenuItem onClick={this.closeMenu}>{this.props.displayName}</MenuItem>
            </Menu>
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

export default withTranslation()(NavBar);
