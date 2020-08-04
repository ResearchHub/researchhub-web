import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

class ReCaptchaPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.recaptchaRef = React.createRef();
  }

  render() {
    return <form onSubmit={this.submit}></form>;
  }
}
