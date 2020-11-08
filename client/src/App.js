import * as axios from "axios";
import React, { Component } from "react";
import "./App.css";
import LandTH from "./contracts/LandTH.json";
import getWeb3 from "./common/getWeb3";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink
} from "react-router-dom";
import NavBar from "./common/NavBar";
import LandList from "./landlist";
import LandAdd from "./landadd";
import LandTypeAdd from "./landtypeadd";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      officer: null,
      org: null,
      landTypes: [],
      lands: []
    };
    this.addLand = this.addLand.bind(this);
    this.addLandType = this.addLandType.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LandTH.networks[networkId];
      if (!deployedNetwork) {
        throw new Error('Contract not deployed in this network');
      }
      const instance = new web3.eth.Contract(
        LandTH.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ web3, accounts, contract: instance }, this.getDataFromChain);

      // Get landtypes
      this.getLandTypes();
    } catch (error) {
      // Catch any errors for any of the above operations.
      // alert(
      //   `Failed to load web3, accounts, or contract. Check console for details.`,
      // );
      console.error(error);
    }
  };

  getDataFromChain = async () => {
    const { accounts, contract } = this.state;

    const officer = await contract.methods.officers(accounts[0]).call();
    const org = await contract.methods.orgs(officer.orgId).call();

    this.setState({ officer, org });
  }

  getLandTypes = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URI + '/api/v1/landtypes');
      this.setState({ landTypes: response.data });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  addLand = async (landTypeId, issueDate, geom) => {
    const { accounts, contract } = this.state;

    return await contract.methods.addLand(
      landTypeId,
      issueDate,
      geom
    ).send({ from: accounts[0] });
  }

  addLandType = async (name, description) => {
    const { accounts, contract } = this.state;

    return await contract.methods.addLandType(
      name,
      description
    ).send({ from: accounts[0] });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Router>
        <div className="App">
          <NavBar
            displayName={this.state.accounts != null ? this.state.accounts[0] : 'Guest'}
          />
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4}>
                <List component="nav" aria-label="menu">
                  <ListItem button component={RouterLink} to="/">
                    <ListItemText
                      primary="รูปแปลงทั้งหมด"
                    />
                  </ListItem>
                  <ListItem button component={RouterLink} to="/addland">
                    <ListItemText
                      primary="เพิ่มรูปแปลง"
                    />
                  </ListItem>
                  <ListItem button component={RouterLink} to="/addlandtype">
                    <ListItemText
                      primary="เพิ่มชนิดรูปแปลง"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <Switch>
                  <Route path="/addlandtype">
                    <LandTypeAdd
                      org={this.state.org}
                      addLandType={this.addLandType}
                    />
                  </Route>
                  <Route path="/addland">
                    <LandAdd
                      org={this.state.org}
                      addLand={this.addLand}
                      landTypes={this.state.landTypes}
                    />
                  </Route>
                  <Route path="/">
                    <LandList
                      org={this.state.org}
                    />
                  </Route>
                </Switch>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
