/**
 * Connects an ORCID account to an existing Google account.
 */
import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

import OrcidLogin from "~/components/OrcidLogin";
import Button from "~/components/Form/Button";

import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";

import {
  ORCID_CLIENT_ID,
  ORCID_REDIRECT_URI,
  orcidMethods,
} from "~/config/constants";
import { useRouter } from "next/router";

const OrcidConnectButton = (props) => {
  const {
    // state
    auth,
    // dispatch
    getUser,
    login,
    setMessage,
    showMessage,
    // passed
    customLabel,
    customLabelStyle,
    iconStyle,
    refreshProfileOnSuccess,
    iconButton,
  } = props;

  const router = useRouter();

  async function showSuccessMessage() {
    if (refreshProfileOnSuccess && auth.user.author_profile.id) {
      router.push(`/user/${auth.user.author_profile.id}`);
    }
  }

  function showLoginFailureMessage(response) {
    console.error(response);
    setMessage("Failed to connect with ORCID");
    showMessage({ show: true, error: true });
  }

  const buildRedirectUri = () => {
    let hostname = props.hostname || window.location.host;
    let scheme = "http";

    if (!hostname.includes("localhost")) {
      scheme += "s";
    }
    return scheme + "://" + hostname + "/orcid/connect";
  };

  return (
    <OrcidLogin
      clientId={ORCID_CLIENT_ID}
      redirectUri={buildRedirectUri()}
      method={orcidMethods.CONNECT}
      onSuccess={showSuccessMessage}
      onFailure={showLoginFailureMessage}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => {
        return (
          <Fragment>
            {iconButton ? (
              <img
                src={"/static/icons/orcid.png"}
                onClick={renderProps.onClick}
                className={css(
                  styles.iconButton,
                  renderProps.disabled && styles.disabled
                )}
              />
            ) : (
              <Button
                disabled={renderProps.disabled}
                onClick={renderProps.onClick}
                rippleClass={styles.rippleClass}
                customButtonStyle={[styles.button, props.styles]}
                icon={"/static/icons/orcid.png"}
                customLabelStyle={customLabelStyle}
                customIconStyle={[styles.iconStyle, iconStyle]}
                label={customLabel ? customLabel : "Sign in ORCID"}
                // isWhite={true}
              />
            )}
          </Fragment>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    height: 30,
    width: 30,
  },
  button: {
    height: 45,
    padding: "0px 16px",
    marginBottom: 0,
    width: "unset",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 45,
    },

    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  rippleClass: {
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  iconButton: {
    height: 35,
    width: 35,
    background: "none",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  login: AuthActions.orcidLogin,
  getUser: AuthActions.getUser,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrcidConnectButton);
