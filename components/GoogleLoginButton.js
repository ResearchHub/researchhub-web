import { GoogleLogin } from "react-google-login";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/browser";
import { sendAmpEvent } from "~/config/fetch";

import Button from "~/components/Form/Button";
import { AuthActions } from "../redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { BannerActions } from "~/redux/banner";

import { GOOGLE_CLIENT_ID } from "~/config/constants";
import colors from "~/config/themes/colors";
import { useEffect } from "react";

const GoogleLoginButton = (props) => {
  let { customLabel, hideButton, isLoggedIn, auth, disabled } = props;
  const router = useRouter();

  useEffect(promptYolo, [auth.authChecked]);

  function promptYolo() {
    if (!auth.isLoggedIn && auth.authChecked && google) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleYolo,
      });
      google.accounts.id.prompt((notification) => {
        console.log(notification);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        }
      });
    }
  }

  async function handleYolo(data) {
    let { googleYoloLogin, getUser } = props;

    await googleYoloLogin(data).then((action) => {
      if (action.loginFailed) {
        showLoginFailureMessage(action);
      } else {
        getUser().then((userAction) => {
          props.loginCallback && props.loginCallback(); // closes banner if user signs in from banner
          props.showSignupBanner && props.removeBanner();
          if (!userAction.user.has_seen_orcid_connect_modal) {
            const payload = {
              event_type: "user_signup",
              time: +new Date(),
              user_id: userAction.user.id,
              insert_id: `user_${userAction.user.id}`,
              event_properties: {
                interaction: "User Signup",
              },
            };
            sendAmpEvent(payload);
            // push user to onboarding - will eventually see the orcid modal
            router.push(
              "/user/[authorId]/onboard?internal=true",
              `/user/${userAction.user.author_profile.id}/onboard`
            );
          }
        });
      }
    });
  }

  const responseGoogle = async (response) => {
    const { googleLogin, getUser } = props;
    response["access_token"] = response["accessToken"];
    await googleLogin(response).then((action) => {
      if (action.loginFailed) {
        showLoginFailureMessage(action);
      } else {
        getUser().then((userAction) => {
          props.loginCallback && props.loginCallback();
          props.showSignupBanner && props.removeBanner();
          if (!userAction.user.has_seen_orcid_connect_modal) {
            let payload = {
              event_type: "user_signup",
              time: +new Date(),
              user_id: userAction.user.id,
              insert_id: `user_${userAction.user.id}`,
              event_properties: {
                interaction: "User Signup",
              },
            };
            sendAmpEvent(payload);

            // push user to onboarding - will eventually see the orcid modal
            router.push(
              "/user/[authorId]/onboard?internal=true",
              `/user/${userAction.user.author_profile.id}/onboard`
            );
          }
        });
      }
    });
  };

  function showLoginFailureMessage(response) {
    Sentry.captureEvent(response);
    console.error(response);
    handleError(response);
  }

  function handleError(response) {
    switch (response.error) {
      case "popup_closed_by_user": // incognito or if user exits flow voluntarily
      case "idpiframe_initialization_failed": // incognito
        return null;
      default:
        props.setMessage("Login failed");
        return props.showMessage({ show: true, error: true });
    }
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
                disabled={renderProps.disabled || disabled}
                onClick={renderProps.onClick}
                customButtonStyle={[styles.button, props.styles]}
                icon={"/static/icons/google.png"}
                rippleClass={props.rippleClass}
                customLabelStyle={props.customLabelStyle}
                customIconStyle={[styles.iconStyle, props.iconStyle]}
                label={customLabel ? customLabel : "Sign In with Google"}
              />
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
  googleYoloLogin: AuthActions.googleYoloLogin,
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
