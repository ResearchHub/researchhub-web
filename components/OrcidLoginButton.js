import { StyleSheet } from "aphrodite";
import { connect } from "react-redux";

import OrcidLogin from "~/components/OrcidLogin";
import Button from "~/components/Form/Button";

import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";

import { ORCID_CLIENT_ID, ORCID_REDIRECT_URI } from "~/config/constants";

const OrcidLoginButton = (props) => {
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
  } = props;

  async function forwardResponse(response) {
    console.log("response", response);
    response["access_token"] = response["accessToken"];

    await login(response).then(function() {
      getUser();
    });

    if (auth.loginFailed) {
      showLoginFailureMessage();
    }
  }

  function showLoginFailureMessage(response) {
    console.error(response);
    setMessage("Login failed");
    showMessage({ show: true, error: true });
  }

  return (
    <OrcidLogin
      clientId={ORCID_CLIENT_ID}
      redirectUri={ORCID_REDIRECT_URI}
      onSuccess={forwardResponse}
      onFailure={showLoginFailureMessage}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <Button
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          customButtonStyle={[styles.button, props.styles]}
          icon={
            "https://ndownloader.figshare.com/files/8439047/preview/8439047/preview.jpg"
          }
          customLabelStyle={customLabelStyle}
          customIconStyle={[styles.iconStyle, iconStyle]}
          label={customLabel ? customLabel : "Log in with ORCID"}
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
  login: AuthActions.orcidLogin,
  getUser: AuthActions.getUser,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrcidLoginButton);
