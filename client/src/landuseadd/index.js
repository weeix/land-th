import React, { Component } from "react";
import { Button, FormControl, InputLabel, Select, TextField } from "@material-ui/core";

class LandUseAdd extends Component {
  constructor(props) {
    super(props);
    const today = new Date().toISOString().slice(0,10);
    this.state = {
      landUseTypeId: "",
      landId: 1,
      issueDate: today,
      expireDate: ""
    };
    this.handleIssueDateChange = this.handleIssueDateChange.bind(this);
    this.handleExpireDateChange = this.handleExpireDateChange.bind(this);
    this.handleLandUseTypeChange = this.handleLandUseTypeChange.bind(this);
    this.handleLandIdChange = this.handleLandIdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIssueDateChange(event) {
    this.setState({ issueDate: event.target.value });
  }

  handleExpireDateChange(event) {
    this.setState({ expireDate: event.target.value });
  }

  handleLandUseTypeChange(event) {
    this.setState({ landUseTypeId: event.target.value });
  }

  handleLandIdChange(event) {
    this.setState({ landId: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const issueDate = (new Date(this.state.issueDate).getTime()) / 1000;
    const expireDate = this.state.expireDate === "" ?
      -1 :
      (new Date(this.state.expireDate).getTime()) / 1000;
    this.props.addLandUse(
      this.state.landUseTypeId,
      this.state.landId,
      issueDate,
      expireDate
    );
  }

  render() {
    const orgName = this.props.org? this.props.org.name : "";
    const orgAbbr = this.props.org? this.props.org.abbr : "";
    return (
      <div>
        <h1>เพิ่มการใช้รูปแปลง</h1>
        <p>
          หน่วยงาน: {orgName} ({orgAbbr})
        </p>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div style={{ margin: '1em 0' }}>
            <TextField
              id="geom-wkt"
              label="รหัสแปลง"
              variant="outlined"
              onChange={this.handleLandIdChange}
              value={this.state.landId}
            />
          </div>
          <FormControl variant="outlined" style={{ minWidth: '180px' }}>
            <InputLabel htmlFor="land-use-type">ประเภทการใช้</InputLabel>
            <Select
              native
              onChange={this.handleLandUseTypeChange}
              value={this.state.landUseTypeId}
              label="ประเภทการใช้"
              inputProps={{
                name: 'land-use-type',
                id: 'land-use-type'
              }}
            >
              <option aria-label="ไม่มี" value="" />
              {this.props.landUseTypes.map((landUseType) => (
                <option key={landUseType.id} value={landUseType.id}>{landUseType.name}</option>
              ))}
            </Select>
          </FormControl>
          <div>
            <TextField
              id="issue-date"
              label="วันที่เริ่มใช้"
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
          <div>
            <TextField
              id="expire-date"
              label="วันที่สิ้นสุดการใช้"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleExpireDateChange}
              value={this.state.expireDate}
            />
          </div>
          <Button variant="contained" color="primary" style={{ margin: '1em 0' }} type="submit">
            เพิ่มการใช้รูปแปลง
          </Button>
        </form>
      </div>
    );
  }
}

export default LandUseAdd;
