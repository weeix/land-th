import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@material-ui/core";
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

class LandShow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infos: [
        { label: '...', value: '' }
      ],
      geom: null
    };
  }

  componentDidMount = async () => {
    const { match } = this.props;
    const land = await this.props.getSingleLand(match.params.id);
    const issueDate = new Date(parseInt(land.issueDate) * 1000);
    const issueDateString = issueDate.toLocaleDateString('th', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const infos = [
      { label: 'วันที่ประกาศ', value: issueDateString }
    ]
    const geom = new Wkt.Wkt(land.geom);
    this.setState({ infos, geom: geom.toJson() });
    console.log(land);
  };

  render() {
    const { match } = this.props;
    const landGeom = () => {
      if (this.state.geom) {
        return <GeoJSON key={match.params.id} data={this.state.geom} />
      }
    }
    return (
      <div>
        <h1>รูปแปลงรหัส {match.params.id}</h1>
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
      </div>
    );
  }
}

export default withRouter(LandShow);
