import { GoogleLogin } from "react-google-login";
import { StyleSheet } from "aphrodite";
import { connect } from "react-redux";

import Button from "~/components/Form/Button";

import { AuthActions } from "../redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

import { GOOGLE_CLIENT_ID } from "~/config/constants";

const GoogleLoginButton = (props) => {
  let { customLabel } = props;

  const responseGoogle = async (response) => {
    let { googleLogin, getUser } = props;
    response["access_token"] = response["accessToken"];

    await googleLogin(response).then((_) => {
      getUser().then((_) => {});
    });

    if (props.auth.loginFailed) {
      showLoginFailureMessage();
    } else {
      if (!user.has_seen_orcid_connect_modal) {
        props.openOrcidConnectModal(true);
      }
    }
  };

  function showLoginFailureMessage(response) {
    props.setMessage("Login failed");
    props.showMessage({ show: true, error: true });
  }

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      onSuccess={responseGoogle}
      onFailure={showLoginFailureMessage}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <Button
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          customButtonStyle={[styles.button, props.styles]}
          icon={"/static/icons/google.png"}
          customLabelStyle={props.customLabelStyle}
          customIconStyle={[styles.iconStyle, props.iconStyle]}
          label={customLabel ? customLabel : "Log in with Google"}
        />
      )}
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
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
  openOrcidConnectModal: ModalActions.openOrcidConnectModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleLoginButton);
