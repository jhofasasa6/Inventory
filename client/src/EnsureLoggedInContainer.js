import React, { Component } from "react";

class EnsureLoggedInContainer extends Component {
  render() {
    if (false) {
      console.log(123);
      return this.props.children;
    } else {
      return null;
    }
  }
}

export default EnsureLoggedInContainer;
