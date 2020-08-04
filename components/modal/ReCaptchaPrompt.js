import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { StyleSheet, css } from "aphrodite";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { RECAPTCHA_CLIENT_KEY } from "~/config/constants";

class ReCaptchaPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.recaptchaRef = React.createRef();
  }

  componentDidMount() {
    console.log("this.recaptchaRef.current", this.recaptchaRef.current);
    setTimeout(() => {
      this.recaptchaRef.current.execute();
    }, 8000);
  }

  onSuccess = (e) => {
    console.log("success", e);
  };

  onError = (e) => {
    console.log("error", e);
  };

  render() {
    return (
      <form onSubmit={this.submit}>
        <ReCAPTCHA
          ref={this.recaptchaRef}
          sitekey={RECAPTCHA_CLIENT_KEY}
          onChange={this.onSuccess}
          onExpired={this.onError}
          onErrored={this.onError}
          size={"normal"}
        />
      </form>
    );
  }
}

export default ReCaptchaPrompt;
