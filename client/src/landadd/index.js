import React, { Component } from "react";
import { Button, FormControl, InputLabel, Select, TextField } from "@material-ui/core";
import { withTranslation } from "react-i18next";

class LandAdd extends Component {
  constructor(props) {
    super(props);
    const today = new Date().toISOString().slice(0,10);
    this.state = {
      landTypeId: "",
      issueDate: today,
      geomWKT: "MULTIPOLYGON (((100.580129 13.849321,100.579834 13.849479,100.579901 13.849594,100.580008 13.849605,100.580225 13.849484,100.580129 13.849321)))",
    };
    this.handleIssueDateChange = this.handleIssueDateChange.bind(this);
    this.handleLandTypeChange = this.handleLandTypeChange.bind(this);
    this.handleGeomWKTChange = this.handleGeomWKTChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIssueDateChange(event) {
    this.setState({ issueDate: event.target.value });
  }

  handleLandTypeChange(event) {
    this.setState({ landTypeId: event.target.value });
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
    const { t } = this.props;
    const orgName = this.props.org? this.props.org.name : "";
    const orgAbbr = this.props.org? this.props.org.abbr : "";
    return (
      <div>
        <h1>{t('newAllocation')}</h1>
        <p>
        {t('agency')}: {orgName} ({orgAbbr})
        </p>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id="issue-date"
              label={t('issueDate')}
              required
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
          <FormControl variant="outlined" style={{ minWidth: '180px' }}>
            <InputLabel htmlFor="land-type">{t('landType')}</InputLabel>
            <Select
              native
              onChange={this.handleLandTypeChange}
              value={this.state.landTypeId}
              label={t('landType')}
              required
              inputProps={{
                name: 'land-type',
                id: 'land-type'
              }}
            >
              <option aria-label={t('none')} value="" />
              {this.props.landTypes.map((landType) => (
                <option key={landType.id} value={landType.id}>{landType.name}</option>
              ))}
            </Select>
          </FormControl>
          <div style={{ margin: '1em 0' }}>
            <TextField
              id="geom-wkt"
              label="WKT"
              required
              multiline
              rows={4}
              variant="outlined"
              style={{ width: '100%' }}
              onChange={this.handleGeomWKTChange}
              value={this.state.geomWKT}
            />
          </div>
          <Button variant="contained" color="primary" style={{ margin: '1em 0' }} type="submit">
            {t('addAllocation')}
          </Button>
        </form>
      </div>
    );
  }
}

export default withTranslation()(LandAdd);
