import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";

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
    return (
      <div>
        <h1>เพิ่มชนิดรูปแปลง</h1>
        <p>
          หน่วยงาน: {orgName} ({orgAbbr})
        </p>
        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id="name"
              label="ชื่อ"
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
              label="คำอธิบาย"
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
            เพิ่มชนิดรูปแปลง
          </Button>
        </form>
      </div>
    );
  }
}

export default LandTypeAdd;
