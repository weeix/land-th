import * as axios from "axios";
import {
  Breadcrumbs,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@material-ui/core";
import {
  DataGrid
} from "@mui/x-data-grid";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { GeoJSON as GeoJSONObj } from "leaflet";
import {
  GeoJSON,
  MapConsumer,
  MapContainer,
  TileLayer
} from "react-leaflet";
import * as Wkt from "wicket";
import { withTranslation } from 'react-i18next';

class LandShow extends Component {

  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      columns: [
        { field: 'id', headerName: t('id'), type: 'number' },
        { field: 'type', headerName: t('type') },
        { field: 'issueDate', headerName: t('issueDate'), width: 150 },
        { field: 'expireDate', headerName: t('expireDate'), width: 150 }
      ],
      infos: [
        { label: '...', value: '' }
      ],
      geom: null,
      landUses: [],
      landUsesCount: 0,
      landUsesCurrentPage: 0,
      landUsesTotalPages: 1,
      landUsesPerPage: 10,
      landUsesLoading: false,
    };
    this.handleLandUsesCurrentPageChange = this.handleLandUsesCurrentPageChange.bind(this);
    this.handleLandUsesPerPageChange = this.handleLandUsesPerPageChange.bind(this);
  }

  componentDidMount = async () => {
    setTimeout(this.getLandData.bind(this), 50);
    this.getLandUses();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps.landTypes !== this.props.landTypes) {
      // if landTypes updated, reload data
      await this.getLandData();
    }
    if (
      prevState.landUsesCurrentPage !== this.state.landUsesCurrentPage ||
      prevState.landUsesPerPage !== this.state.landUsesPerPage
    ) {
      this.getLandUses();
    }
  }

  getLandData = async () => {
    const { match, landTypes, t } = this.props;
    const land = await this.props.getSingleLand(match.params.id);
    if (!land) {
      return;
    }
    const issueDate = new Date(parseInt(land.issueDate) * 1000);
    const issueDateString = issueDate.toLocaleDateString('th', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    let landTypeString = land.landTypeId;
    for (const landType of landTypes) {
      const landTypeIdVal = parseInt(land.landTypeId);
      if (landTypeIdVal === landType.id) {
        landTypeString = landType.name + ' (' + landType.description + ')';
      }
    }
    const infos = [
      { label: t('issueDate'), value: issueDateString },
      { label: t('landType'), value: landTypeString}
    ]
    const geom = new Wkt.Wkt(land.geom);
    this.setState({ infos, geom: geom.toJson() });
  }

  getLandUses = async () => {
    try {
      this.setState({ landUsesLoading: true });
      const { match } = this.props;
      const response = await axios.get(
        process.env.REACT_APP_SERVER_URI + '/api/v1/lands/' + match.params.id + '/usages',
        {
          params: {
            page: this.state.landUsesCurrentPage,
            size: this.state.landUsesPerPage
          }
        }
      );
      const { totalPages, items, totalItems } = response.data;
      const landuses = items.map(row => {
        let landuse = {};
        let landusetype = '';

        if ('landusetype' in row) {
          landusetype = row.landusetype.name;
        }

        const issueDate = new Date(row.issueDate * 1000);
        const issueDateString = issueDate.toLocaleDateString('th', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        let expireDateString = '-';
        if (row.expireDate) {
          const expireDate = new Date(row.expireDate * 1000);
          expireDateString = expireDate.toLocaleDateString('th', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
        }

        landuse['id'] = row.id;
        landuse['type'] = landusetype;
        landuse['issueDate'] = issueDateString;
        landuse['expireDate'] = expireDateString;

        return landuse;
      });
      this.setState({
        landUses: landuses,
        landUsesCount: totalItems,
        landUsesTotalPages: totalPages
      }, () => {
        this.setState({ landUsesLoading: false });
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleLandUsesCurrentPageChange = (page) => {
    this.setState({
      landUsesCurrentPage: page
    });
  }

  handleLandUsesPerPageChange = (pageSize) => {
    this.setState({
      landUsesPerPage: pageSize
    });
  }

  render() {
    const { t } = this.props;
    const { match } = this.props;
    const landGeom = () => {
      if (this.state.geom) {
        return <GeoJSON key={match.params.id} data={this.state.geom} />
      }
    }
    return (
      <React.Fragment>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
          <Link color="inherit" href="/">{t('allAllocations')}</Link>
          <Typography>{t('landNo')} {match.params.id}</Typography>
        </Breadcrumbs>
        <h1>{t('landNo')} {match.params.id}</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {this.state.infos.map((info) => (
                <TableRow key={info.label}>
                  <TableCell variant="head">{info.label}</TableCell>
                  <TableCell>{info.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <MapContainer id="single-land-map" center={[16, 100]} zoom={6} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {landGeom()}
          <MapConsumer>
            {(map) => {
              if (this.state.geom) {
                const bounds = (new GeoJSONObj(this.state.geom)).getBounds();
                map.fitBounds(bounds);
              }
              return null;
            }}
          </MapConsumer>
        </MapContainer>
        <h2>{t('landActivities')}</h2>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            columns={this.state.columns}
            rows={this.state.landUses}
            pagination
            paginationMode="server"
            rowCount={this.state.landUsesCount}
            rowsPerPageOptions={[10,50,100]}
            page={this.state.landUsesCurrentPage}
            pageSize={this.state.landUsesPerPage}
            onPageChange={this.handleLandUsesCurrentPageChange}
            onPageSizeChange={this.handleLandUsesPerPageChange}
            loading={this.state.landUsesLoading}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(withTranslation()(LandShow));
