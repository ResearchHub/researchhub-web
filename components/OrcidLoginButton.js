import { StyleSheet } from "aphrodite";
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

  async function showSuccessMessage() {
    setMessage("Logged in!");
    showMessage({ show: true, error: false });
  }

  function showLoginFailureMessage(response) {
    console.error(response);
    setMessage("ORCID login failed");
    showMessage({ show: true, error: true });
  }

  return (
    <OrcidLogin
      clientId={ORCID_CLIENT_ID}
      redirectUri={ORCID_REDIRECT_URI}
      method={orcidMethods.LOGIN}
      onSuccess={showSuccessMessage}
      onFailure={showLoginFailureMessage}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <Button
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          customButtonStyle={[styles.button, props.styles]}
          icon={"/static/icons/orcid.png"}
          customLabelStyle={customLabelStyle}
          customIconStyle={[styles.iconStyle, iconStyle]}
          label={customLabel ? customLabel : "Sign in ORCID"}
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
