import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router"

class LandShow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      infos: [
        { label: '...', value: '' }
      ]
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
    this.setState({ infos });
    console.log(land);
  };

  render() {
    const { match } = this.props;
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
      </div>
    );
  }
}

export default withRouter(LandShow);
