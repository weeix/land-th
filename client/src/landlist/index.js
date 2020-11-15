import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { Component } from "react";

class LandList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { field: 'id', headerName: 'รหัส', type: 'number' },
        { field: 'location', headerName: 'พื้นที่' },
        { field: 'issueDate', headerName: 'วันที่ประกาศ', type: 'date' }
      ],
      rows: [
        { id: 1, location: 'อ.ลาดยาว จ.นครสวรรค์', issueDate: '2020-09-20' },
        { id: 2, location: 'อ.ขุนยวม จ.แม่ฮ่องสอน', issueDate: '2020-09-20' },
        { id: 3, location: 'อ.ปาย จ.แม่ฮ่องสอน', issueDate: '2020-09-20' },
        { id: 4, location: 'อ.หางดง จ.เชียงใหม่', issueDate: '2020-09-22' },
        { id: 5, location: 'อ.กุดจับ จ.อุดรธานี', issueDate: '2020-09-22' },
        { id: 6, location: 'อ.กุดจับ จ.อุดรธานี', issueDate: '2020-09-26' },
        { id: 7, location: 'อ.บ้านไผ่ จ.ขอนแก่น', issueDate: '2020-09-26' }
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>รหัส</TableCell>
                <TableCell>พื้นที่</TableCell>
                <TableCell align="right">วันที่ประกาศ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.lands.map((land) => (
                <TableRow key={land.id}>
                  <TableCell>{land.id}</TableCell>
                  <TableCell>{land.location}</TableCell>
                  <TableCell align="right">{land.issueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default LandList;
