import React from "react";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { StyleSheet, css } from "aphrodite";

// Component
import BaseModal from "./BaseModal";
import { RHLogo } from "~/config/themes/icons";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "~/config/helpers";
import colors from "~/config/themes/colors";
import { RECAPTCHA_CLIENT_KEY } from "~/config/constants";

class ReCaptchaPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };

    this.recaptchaRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.modals.openRecaptchaPrompt) {
      this.recaptchaRef.current && this.recaptchaRef.current.execute();
      this.setState({ show: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.modals.openRecaptchaPrompt !==
      this.props.modals.openRecaptchaPrompt
    ) {
      if (this.props.modals.openRecaptchaPrompt && !this.state.show) {
        this.recaptchaRef.current && this.recaptchaRef.current.execute();
        this.setState({ show: true });
      } else if (!this.props.modals.openRecaptchaPrompt && this.state.show) {
        this.setState({ show: false });
      }
    }
  }

  onSuccess = (hash) => {
    let { auth } = this.props;
    let userId = auth.user.id;
    let payload = {
      response: hash,
    };
    return fetch(API.CAPTCHA_VERIFY, API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        document.body.style.overflow = "scroll";
        this.props.openRecaptchaPrompt(false);
      });
  };

  onError = (e) => {
    this.recaptchaRef.current.reset();
    this.recaptchaRef.current.execute();
  };

  render() {
    return (
      <BaseModal
        isOpen={this.props.modals.openRecaptchaPrompt}
        closeModal={null}
        closeOnOverlayClick={false}
        title={"Recaptcha"}
        removeDefault={true}
      >
        <div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <RHLogo iconStyle={styles.logo} />
            <h3 className={css(styles.text)}>
              {
                "We want to make sure it's actually you \n we are dealing with and not a robot."
              }
            </h3>
            <p className={css(styles.subtext)}>
              Please click below to access the site.
            </p>
          </div>
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
        </div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    background: "#FFF",
    padding: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    textAlign: "center",
  },
  text: {
    width: "100%",
    textAlign: "center",
    marginTop: 0,
    marginBottom: 10,
    whiteSpace: "pre-wrap",
    fontWeight: 400,
    fontSize: 18,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  subtext: {
    marginTop: 0,
    marginBottom: 30,
    whiteSpace: "pre-wrap",
    fontWeight: 400,
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  logo: {
    height: 30,
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  modals: state.modals,
});

const mapDispatchToProps = {
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReCaptchaPrompt);
