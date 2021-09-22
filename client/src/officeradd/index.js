import React, { Component } from "react";
import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@material-ui/core";
import { withTranslation } from "react-i18next";

class OfficerAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      officerAddress: '0xC81F79500B01D9b38d3Ef9C5e94E12586622541d',
      officerRef: '14567',
      officerCid: '5929102456691',
      officerRefHash: '0348929d6da3d00b1ab08eb45b51e95cc802fd53f56370d0b71c294f5995e2b5',
      officerIsAdmin: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addOfficer(
      this.state.officerAddress,
      this.state.officerRef,
      this.state.officerRefHash,
      this.officerIsAdmin
    );
  }

  render() {
    const orgName = this.props.org? this.props.org.name : "";
    const orgAbbr = this.props.org? this.props.org.abbr : "";
    const { t } = this.props;
    return (
      <div>
        <h1>{t('addOfficer')}</h1>
        <p>
          {t('agency')}: {orgName} ({orgAbbr})
        </p>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id="officerAddress"
              name="officerAddress"
              label={t('officerAddress')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleInputChange}
              value={this.state.officerAddress}
            />
          </div>
          <div>
            <TextField
              id="officerRef"
              name="officerRef"
              label={t('officerRef')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleInputChange}
              value={this.state.officerRef}
            />
          </div>
          <div>
            <TextField
              id="officerRefHash"
              name="officerRefHash"
              label={t('officerRefHash')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleInputChange}
              value={this.state.officerRefHash}
            />
          </div>
          <div>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label={t('isAdmin')}
              />
            </FormGroup>
          </div>
          <Button variant="contained" color="primary" style={{ margin: '1em 0' }} type="submit">
          {t('newOfficer')}
          </Button>
        </form>
      </div>
    );
  }
}

export default withTranslation()(OfficerAdd);
