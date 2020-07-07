import { GoogleLogin } from "react-google-login";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

import Button from "~/components/Form/Button";
import { AuthActions } from "../redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { BannerActions } from "~/redux/banner";

import { GOOGLE_CLIENT_ID } from "~/config/constants";
import colors from "~/config/themes/colors";
import API from "../config/api";

const GoogleLoginButton = (props) => {
  let { customLabel, hideButton, isLoggedIn } = props;

  const responseGoogle = async (response) => {
    let { googleLogin, getUser } = props;
    response["access_token"] = response["accessToken"];

    await googleLogin(response).then((action) => {
      if (action.loginFailed) {
        showLoginFailureMessage();
      } else {
        getUser().then((userAction) => {
          props.loginCallback && props.loginCallback();
          props.showSignupBanner && props.removeBanner();
          if (!userAction.user.has_seen_orcid_connect_modal) {
            props.openOrcidConnectModal(true);
          }
        });
      }
    });
  };

  function showLoginFailureMessage(response) {
    console.error(response);
    props.setMessage("Login failed");
    props.showMessage({ show: true, error: true });
  }

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      onSuccess={responseGoogle}
      onFailure={showLoginFailureMessage}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => {
        if (hideButton) {
          return (
            <div
              className={css(styles.buttonLabel)}
              onClick={renderProps.onClick}
            >
              {customLabel && customLabel}
            </div>
          );
        } else {
          return (
            <div className={css(styles.glogin)}>
              <Button
                disabled={renderProps.disabled}
                onClick={renderProps.onClick}
                customButtonStyle={[styles.button, props.styles]}
                icon={"/static/icons/google.png"}
                rippleClass={props.rippleClass}
                customLabelStyle={props.customLabelStyle}
                customIconStyle={[styles.iconStyle, props.iconStyle]}
                label={customLabel ? customLabel : "Login with Google"}
              />
              <div
                className={css(styles.onetap)}
                id="g_id_onload"
                data-auto_select="true"
                data-client_id={GOOGLE_CLIENT_ID}
                data-login_uri={API.GOOGLE_LOGIN}
              ></div>
            </div>
          );
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    height: 33,
    width: 33,
  },
  button: {
    height: 55,
    width: 230,
    marginTop: 10,
    marginBottom: 0,
    "@media only screen and (max-width: 415px)": {
      height: 50,
      width: 200,
    },
  },
  buttonLabel: {
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  showSignupBanner: state.banners.showSignupBanner,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
  openOrcidConnectModal: ModalActions.openOrcidConnectModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  removeBanner: BannerActions.removeBanner,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleLoginButton);
