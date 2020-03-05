/**
 * Connects an ORCID account to an existing Google account.
 */

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
  } = props;

  const router = useRouter();

  async function showSuccessMessage() {
    getUser().then((auth) => {
      if (refreshProfileOnSuccess) {
        const href = "/user/[authorId]/[tabName]";
        router.push(href, `/user/${auth.user.author_profile.id}/contributions`);
      }
    });
  }

  function showLoginFailureMessage(response) {
    console.error(response);
    setMessage("Failed to connect with ORCID");
    showMessage({ show: true, error: true });
  }

  const buildRedirectUri = () => {
    let hostname = props.hostname || window.location.hostname;
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
      render={(renderProps) => (
        <Button
          disabled={renderProps.disabled}
          onClick={renderProps.onClick}
          customButtonStyle={[styles.button, props.styles]}
          icon={"/static/icons/orcid.png"}
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
)(OrcidConnectButton);
