import * as axios from "axios";
import React, { Component } from "react";
import swal from "sweetalert";
import "./App.css";
import LandTH from "./contracts/LandTH.json";
import getWeb3 from "./common/getWeb3";
import {
  Backdrop,
  CircularProgress,
  Container
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { withTranslation } from 'react-i18next';
import NavBar from "./common/NavBar";
import LandList from "./landlist";
import LandAdd from "./landadd";
import LandTypeAdd from "./landtypeadd";
import LandUseAdd from "./landuseadd";
import LandUseTypeAdd from "./landusetypeadd";
import LandShow from "./landshow";
import OfficerAdd from "./officeradd";

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
      lands: [],
      landsCount: 0,
      landsCurrentPage: 0,
      landsTotalPages: 1,
      landsPerPage: 10,
      landsLoading: false,
      landUseTypes: [],
      landUses: [],
      loading: false
    };
    this.addLand = this.addLand.bind(this);
    this.addLandType = this.addLandType.bind(this);
    this.addLandUse = this.addLandUse.bind(this);
    this.addLandUseType = this.addLandUseType.bind(this);
    this.addOfficer = this.addOfficer.bind(this);
    this.getLands = this.getLands.bind(this);
    this.getSingleLand = this.getSingleLand.bind(this);
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
      await this.getLandTypes();

      // Get lands
      await this.getLands();

      // Get landusetypes
      this.getLandUseTypes();

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

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      prevState.landsCurrentPage !== this.state.landsCurrentPage ||
      prevState.landsPerPage !== this.state.landsPerPage
    ) {
      await this.getLands();
    }
  }

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
      this.setState({ landsLoading: true });
      const response = await axios.get(
        process.env.REACT_APP_SERVER_URI + '/api/v1/lands',
        {
          params: {
            page: this.state.landsCurrentPage,
            size: this.state.landsPerPage
          }
        }
      );
      const { totalPages, items, totalItems } = response.data;
      const lands = items.map(row => {
        let land = {};
        let tambon = '';
        let amphoe = '';
        let changwat = '';

        if ('tambon' in row && row.tambon != null) {
          tambon = row.tambon.name;
          if ('amphoe' in row.tambon && row.tambon.amphoe != null) {
            amphoe = row.tambon.amphoe.name;
            if ('changwat' in row.tambon.amphoe && row.tambon.amphoe.changwat != null) {
              changwat = row.tambon.amphoe.changwat.name;
            }
          }
        }

        const locationString = (tambon + ' ' + amphoe + ' ' + changwat).trim();
        const issueDate = new Date(row.issueDate * 1000);
        const issueDateString = issueDate.toLocaleDateString('th', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        let landTypeString = row.landtypeId.toString();
        for (const landType of this.state.landTypes) {
          if (row.landtypeId === landType.id) {
            landTypeString = landType.name;
          }
        }

        land['id'] = row.id;
        land['type'] = landTypeString;
        land['location'] = locationString;
        land['issueDate'] = issueDateString;

        return land;
      });
      this.setState({
        lands: lands,
        landsCount: totalItems,
        landsTotalPages: totalPages
      }, () => {
        this.setState({ landsLoading: false });
      });
    } catch (error) {
      console.error(error);
    }
  }

  getLandUseTypes = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URI + '/api/v1/landusetypes');
      this.setState({ landUseTypes: response.data });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  getSingleLand = async (landId) => {
    const { contract } = this.state;

    if (!contract) {
      return;
    }

    const land = await contract.methods.lands(landId).call();

    return land;
  }

  addLand = async (landTypeId, issueDate, geom) => {
    const { accounts, contract } = this.state;
    const { t } = this.props;

    try {
      this.setState({ loading: true });
      const response = await axios.post(process.env.REACT_APP_SERVER_URI + '/api/v1/lands/overlaps', {
        geom: geom
      });
      if (Array.isArray(response.data) && response.data.length === 0) {
        const result = await contract.methods.addLand(
          landTypeId,
          issueDate,
          geom
        ).send({ from: accounts[0] });
        swal(
          t('succeed'),
          t('addedLand'),
          'success'
        );
        return result;
      } else {
        throw Error('land overlaps with existing lands');
      }
    } catch (error) {
      if (error.message === 'land overlaps with existing lands') {
        swal(
          t('anErrorOccurred'),
          t('landOverlaps'),
          'error'
        );
      } else if (error.message.search('land type must only be created by officer\'s organization') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('cantUseOtherOrgLandType'),
          'error'
        );
      } else if (error.message.search('User denied transaction') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('userDeniedTransaction'),
          'error'
        );
      } else {
        swal(
          t('anErrorOccurred'),
          t('unknownErrorPleaseInspectConsole'),
          'error'
        );
      }
      console.error(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  addLandType = async (name, description) => {
    const { accounts, contract } = this.state;
    const { t } = this.props;

    try {
      this.setState({ loading: true });
      const result = await contract.methods.addLandType(
        name,
        description
      ).send({ from: accounts[0] });
      swal(
        t('succeed'),
        t('addedLandType'),
        'success'
      );
      return result;
    } catch (error) {
      if (error.message.search('must not be empty') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('pleaseSpecifyLandTypeNameAndDescription'),
          'error'
        );
      } else if (error.message.search('User denied transaction') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('userDeniedTransaction'),
          'error'
        );
      } else {
        swal(
          t('anErrorOccurred'),
          t('unknownErrorPleaseInspectConsole'),
          'error'
        );
      }
      console.error(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  addLandUse = async (landUseTypeId, landId, issueDate, expireDate) => {
    const { accounts, contract } = this.state;
    const { t } = this.props;

    try {
      const result = await contract.methods.addLandUse(
        landUseTypeId,
        landId,
        issueDate,
        expireDate
      ).send({ from: accounts[0] });
      swal(
        t('succeed'),
        t('addedLandActivity'),
        'success'
      );
      return result;
    } catch (error) {
      if(error.message.search('land use type must only be created by officer\'s organization') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('cantUseOtherOrgLandActivityType'),
          'error'
        );
      } else {
        swal(
          t('anErrorOccurred'),
          t('unknownErrorPleaseInspectConsole'),
          'error'
        );
      }
      console.error(error);
    }
  }

  addLandUseType = async (name, description) => {
    const { accounts, contract } = this.state;
    const { t } = this.props;

    try {
      const result = await contract.methods.addLandUseType(
        name,
        description
      ).send({ from: accounts[0] });
      swal(
        t('succeed'),
        t('addedLandActivityType'),
        'success'
      );
      return result;
    } catch (error) {
      if(error.message.search('must not be empty') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('pleaseSpecifyLandActivityTypeNameAndDescription'),
          'error'
        );
      } else {
        swal(
          t('anErrorOccurred'),
          t('unknownErrorPleaseInspectConsole'),
          'error'
        );
      }
      console.error(error);
    }
  }

  addOfficer = async (address, ref, refhash, isAdmin) => {
    const { accounts, contract } = this.state;
    const { t } = this.props;

    try {
      const result = await contract.methods.addOfficer(
        address,
        ref,
        refhash,
        isAdmin
      ).send({ from: accounts[0] });
      swal(
        t('succeed'),
        t('addedOfficer'),
        'success'
      );
      return result;
    } catch (error) {
      if (error.message.search('only organizations\' administrator can add users') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('onlyOrgAdminCanAddUsers'),
          'error'
        );
      } else if (error.message.search('address already used') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('addressAlreasyUsed'),
          'error'
        );
      } else if (error.message.search('address must not be empty') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('addressMustntBeEmpty'),
          'error'
        );
      } else if (error.message.search('ref must not be empty') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('refMustntBeEmpty'),
          'error'
        );
      } else if (error.message.search('refHash must not be empty') !== -1) {
        swal(
          t('anErrorOccurred'),
          t('refHashMustntBeEmpty'),
          'error'
        );
      } else {
        swal(
          t('anErrorOccurred'),
          t('unknownErrorPleaseInspectConsole'),
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
    } else if (e.event === 'LandUseTypeCreated') {
      setTimeout(this.getLandUseTypes.bind(this), 3000);
    }
  }

  handleLandsCurrentPageChange = (page) => {
    this.setState({
      landsCurrentPage: page
    });
  }

  handleLandsPerPageChange = (pageSize) => {
    this.setState({
      landsPerPage: pageSize
    });
  }

  render() {
    const { t } = this.props;
    return (
      <Router>
        <div className="App">
          <Backdrop open={!this.state.web3 || this.state.loading} className="backdrop">
            <CircularProgress color="inherit" />
          </Backdrop>
          <NavBar
            displayName={this.state.accounts != null ? this.state.accounts[0] : t('guest')}
            officer={this.state.officer}
          />
          <Container className="container">
            <div className="tool-bar" />
            <main>
              <Switch>
                <Route path="/addofficer">
                  <OfficerAdd
                    org={this.state.org}
                    addOfficer={this.addOfficer}
                  />
                </Route>
                <Route path="/addlandusetype">
                  <LandUseTypeAdd
                    org={this.state.org}
                    addLandUseType={this.addLandUseType}
                  />
                </Route>
                <Route path="/addlanduse">
                  <LandUseAdd
                    org={this.state.org}
                    addLandUse={this.addLandUse}
                    landUseTypes={this.state.landUseTypes}
                  />
                </Route>
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
                <Route path="/lands/:id">
                  <LandShow
                    getSingleLand={this.getSingleLand}
                    landTypes={this.state.landTypes}
                  />
                </Route>
                <Route path="/">
                  <LandList
                    org={this.state.org}
                    lands={this.state.lands}
                    landsCount={this.state.landsCount}
                    landsCurrentPage={this.state.landsCurrentPage}
                    landsPerPage={this.state.landsPerPage}
                    landsLoading={this.state.landsLoading}
                    handleLandsCurrentPageChange={this.handleLandsCurrentPageChange}
                    handleLandsPerPageChange={this.handleLandsPerPageChange}
                  />
                </Route>
              </Switch>
            </main>
            <div className="tool-bar" />
          </Container>
        </div>
      </Router>
    );
  }
}

export default withTranslation()(App);
