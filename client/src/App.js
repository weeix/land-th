import * as axios from "axios";
import React, { Component } from "react";
import swal from "sweetalert";
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

      // Get lands
      this.getLands();

      // Listen for new events
      instance.events.allEvents()
        .on("data", e => this.handleBlockchainEvent(e))
        .on("error", e => console.log(e));
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

  getLands = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URI + '/api/v1/lands');
      const lands = response.data.map(row => {
        let land = {};
        let tambon = '';
        let amphoe = '';
        let changwat = '';

        if ('tambon' in row) {
          tambon = row.tambon.name;
          if ('amphoe' in row.tambon) {
            amphoe = row.tambon.amphoe.name;
            if ('changwat' in row.tambon.amphoe) {
              changwat = row.tambon.amphoe.changwat.name;
            }
          }
        }

        const locationString = (tambon + ' ' + amphoe + ' ' + changwat).trim();
        const issueDate = new Date(row.issueDate * 1000);
        const issueDateString = issueDate.toLocaleDateString('th', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        land['id'] = row.id;
        land['location'] = locationString;
        land['issueDate'] = issueDateString;

        return land;
      });
      this.setState({ lands: lands });
      console.log(lands);
    } catch (error) {
      console.error(error);
    }
  }

  addLand = async (landTypeId, issueDate, geom) => {
    const { accounts, contract } = this.state;

    try {
      const result = await contract.methods.addLand(
        landTypeId,
        issueDate,
        geom
      ).send({ from: accounts[0] });
      swal(
        'สำเร็จ',
        'เพิ่มรูปแปลงแล้ว',
        'success'
      );
      return result;
    } catch (error) {
      if(error.message.search('land type must only be created by officer\'s organization') !== -1) {
        swal(
          'เกิดข้อผิดพลาด',
          'ไม่สามารถเลือกชนิดรูปแปลงของหน่วยงานอื่นได้',
          'error'
        );
      } else {
        swal(
          'เกิดข้อผิดพลาด',
          'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ โปรดดูรายละเอียดใน console',
          'error'
        );
      }
      console.error(error);
    }
  }

  addLandType = async (name, description) => {
    const { accounts, contract } = this.state;

    try {
      const result = await contract.methods.addLandType(
        name,
        description
      ).send({ from: accounts[0] });
      swal(
        'สำเร็จ',
        'เพิ่มชนิดรูปแปลงแล้ว',
        'success'
      );
      return result;
    } catch (error) {
      if(error.message.search('must not be empty') !== -1) {
        swal(
          'เกิดข้อผิดพลาด',
          'โปรดระบุชื่อและคำอธิบายของชนิดรูปแปลง',
          'error'
        );
      } else {
        swal(
          'เกิดข้อผิดพลาด',
          'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ โปรดดูรายละเอียดใน console',
          'error'
        );
      }
      console.error(error);
    }
  }

  handleBlockchainEvent = async (e) => {
    console.log(e);
    if (e.event === 'LandTypeCreated') {
      setTimeout(this.getLandTypes.bind(this), 3000);
    } else if (e.event === 'LandCreated') {
      setTimeout(this.getLands.bind(this), 3000);
    }
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
                      lands={this.state.lands}
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
