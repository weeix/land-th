import {
  IconButton
} from "@material-ui/core";
import {
  Map as MapIcon
} from "@material-ui/icons"
import {
  DataGrid
} from "@mui/x-data-grid";
import React, { Component } from "react";
import { withRouter } from "react-router"

class LandList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { field: 'id', headerName: 'รหัส', type: 'number' },
        { field: 'type', headerName: 'ประเภท' },
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
              const id = params.row.id;
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
          <DataGrid
            columns={this.state.columns}
            rows={this.props.lands}
            pagination
            paginationMode="server"
            rowCount={this.props.landsCount}
            rowsPerPageOptions={[10,50,100]}
            page={this.props.landsCurrentPage}
            pageSize={this.props.landsPerPage}
            onPageChange={this.props.handleLandsCurrentPageChange}
            onPageSizeChange={this.props.handleLandsPerPageChange}
            loading={this.props.landsLoading}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(LandList);
