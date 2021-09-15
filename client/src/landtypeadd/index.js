import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";
import { withTranslation } from "react-i18next";

class LandTypeAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'สทก.',
      description: 'สิทธิ์ทำกิน'
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addLandType(
      this.state.name,
      this.state.description
    );
  }

  render() {
    const orgName = this.props.org? this.props.org.name : "";
    const orgAbbr = this.props.org? this.props.org.abbr : "";
    const { t } = this.props;
    return (
      <div>
        <h1>{t('addAllocationType')}</h1>
        <p>
          {t('agency')}: {orgName} ({orgAbbr})
        </p>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id="name"
              label={t('name')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleNameChange}
              value={this.state.name}
            />
          </div>
          <div>
            <TextField
              id="description"
              label={t('description')}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ margin: '1em 0' }}
              onChange={this.handleDescriptionChange}
              value={this.state.description}
            />
          </div>
          <Button variant="contained" color="primary" style={{ margin: '1em 0' }} type="submit">
            {t('newAllocationType')}
          </Button>
        </form>
      </div>
    );
  }
}

export default withTranslation()(LandTypeAdd);
