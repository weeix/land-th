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
import { withTranslation } from 'react-i18next';

class LandList extends Component {

  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      columns: [
        { field: 'id', headerName: t('id'), type: 'number' },
        { field: 'type', headerName: t('type') },
        { field: 'location', headerName: t('location'), width: 280 },
        { field: 'issueDate', headerName: t('issueDate'), width: 150 },
        {
          field: '',
          headerName: t('map'),
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
    const { t } = this.props;
    return (
      <div>
        <h1>{t('allAllocations')}</h1>
        <p>
          {t('agency')}: {orgName} ({orgAbbr})
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

export default withRouter(withTranslation()(LandList));
