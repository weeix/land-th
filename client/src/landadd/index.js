import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";

class LandAdd extends Component {
  constructor(props) {
    super(props);
    const today = new Date().toISOString().slice(0,10);
    this.state = {
      landTypeId: 1,
      issueDate: today,
      geomWKT: "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
    };
    this.handleIssueDateChange = this.handleIssueDateChange.bind(this);
    this.handleGeomWKTChange = this.handleGeomWKTChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIssueDateChange(event) {
    this.setState({ issueDate: event.target.value });
  }

  handleGeomWKTChange(event) {
    this.setState({ geomWKT: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addLand(
      this.state.landTypeId,
      (new Date(this.state.issueDate).getTime()) / 1000,
      this.state.geomWKT
    );
  }

  render() {
    const orgName = this.props.org? this.props.org.name : "";
    const orgAbbr = this.props.org? this.props.org.abbr : "";
    return (
      <div>
        <h1>เพิ่มรูปแปลง</h1>
        <p>
          หน่วยงาน: {orgName} ({orgAbbr})
        </p>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id="issue-date"
              label="วันที่ประกาศ"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleIssueDateChange}
              value={this.state.issueDate}
            />
          </div>
          <div style={{ margin: '1em 0' }}>
            <TextField
              id="geom-wkt"
              label="WKT"
              multiline
              rows={4}
              variant="outlined"
              style={{ width: '100%' }}
              onChange={this.handleGeomWKTChange}
              value={this.state.geomWKT}
            />
          </div>
          <Button variant="contained" color="primary" style={{ margin: '1em 0' }} type="submit">
            เพิ่มรูปแปลง
          </Button>
        </form>
      </div>
    );
  }
}

export default LandAdd;
