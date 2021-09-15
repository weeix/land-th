import { Component } from "react";
import {
  Backdrop,
  CircularProgress
} from "@material-ui/core";

class Loading extends Component {

  render() {
    return (
      <Backdrop open={true} className="backdrop">
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

}

export default Loading;