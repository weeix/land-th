import {
  IconButton
} from "@material-ui/core";
import {
  DataGrid
} from "@material-ui/data-grid";
import {
  Map as MapIcon
} from "@material-ui/icons"
import React, { Component } from "react";
import { withRouter } from "react-router"

class LandList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { field: 'id', headerName: 'รหัส', type: 'number' },
        { field: 'location', headerName: 'พื้นที่', width: 280 },
        { field: 'issueDate', headerName: 'วันที่ประกาศ', width: 150 },
        {
          field: '',
          headerName: 'แผนที่',
          width: 80,
          sortable: false,
          disableClickEventBubbling: true,
          renderCell: params => {
            const { history } = this.props;
            const onClick = () => {
              const id = params.getValue('id');
              history.push('/lands/' + id);
            }
            return (
              <IconButton onClick={onClick}>
                <MapIcon />
              </IconButton>
            )
          }
        }
      ]
    }
  }

  render() {
    const orgName = this.props.org? this.props.org.name : "";
    const orgAbbr = this.props.org? this.props.org.abbr : "";
    return (
      <div>
        <h1>รูปแปลงทั้งหมด</h1>
        <p>
          หน่วยงาน: {orgName} ({orgAbbr})
        </p>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid columns={this.state.columns} rows={this.props.lands} pageSize={10} />
        </div>
      </div>
    );
  }
}

export default withRouter(LandList);
