import { AuthActions } from "../redux/auth";
import { BannerActions } from "~/redux/banner";
import { connect } from "react-redux";
import { isDevEnv } from "~/config/utils/env";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { sendAmpEvent } from "~/config/fetch";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/browser";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import GoogleButton from "~/components/GoogleLogin";

const GoogleLoginButton = (props) => {
  let { customLabel, hideButton, isLoggedIn, auth, disabled } = props;
  const router = useRouter();

  const responseGoogle = async (response) => {
    const { googleLogin, getUser } = props;

    await googleLogin(response).then((action) => {
      if (action.loginFailed) {
        showLoginFailureMessage(action);
      } else {
        props.openLoginModal(false);
        getUser().then((userAction) => {
          props.loginCallback && props.loginCallback();
          props.showSignupBanner && props.removeBanner();
          if (!userAction?.user?.has_seen_orcid_connect_modal) {
            sendAmpEvent({
              event_type: "user_signup",
              time: +new Date(),
              user_id: userAction.user.id,
              insert_id: `user_${userAction.user.id}`,
              event_properties: {
                interaction: "User Signup",
              },
            });

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

  // TODO: calvinhlee - CLEAN THIS UP
  function showLoginFailureMessage(response) {
    Sentry.captureEvent(response);
    console.error(response);
    handleError(response);
  }
  // TODO: calvinhlee - CLEAN THIS UP
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
    <GoogleButton
      login={responseGoogle}
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
            <div
              className={css(styles.glogin)}
              data-test={isDevEnv() ? `google-login-btn` : undefined}
            >
              <Button
                disabled={disabled}
                fullWidth
                variant="outlined"
                onClick={renderProps.onClick}
                customButtonStyle={[styles.button, props.styles]}
                icon={"/static/icons/google.png"}
                hideRipples={true}
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
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleLoginButton);
