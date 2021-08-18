import { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";
import { parseCookies, setCookie } from "nookies";

// Redux
import { AuthActions } from "~/redux/auth";

import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import Button from "../Form/Button";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { sendAmpEvent } from "~/config/fetch";

const removeUserBanner = () => {
  const cookies = parseCookies();
  if (typeof window === "undefined") {
    return cookies.bannerPref && cookies.bannerPref === "false";
  } else {
    const bannerRef = localStorage.getItem("researchhub.banner.pref");
    return (
      (cookies.bannerPref && cookies.bannerPref === "false") ||
      (bannerRef && bannerRef === "false")
    );
  }
};

const CreateFeedBanner = (props) => {
  const { loggedIn } = props;
  const [remove, setRemove] = useState(removeUserBanner());
  const buttonRef = useRef();

  useEffect(() => {
    setRemove(removeUserBanner());
  }, []);

  const navigateToUserOnboardPage = () => {
    const { user } = props.auth;
    const authorId = user.author_profile.id;
    handleAmpEvent("click");

    Router.push({
      pathname: `/user/${authorId}/onboard`,

      query: {
        selectHubs: true,
      },
    });
  };

  const onClose = (e) => {
    e && e.stopPropagation();
    handleAmpEvent("close");

    setCookie(null, "bannerPref", "false");
    localStorage.setItem("researchhub.banner.pref", "false");
    setRemove(true);
  };

  const onBannerClick = (e) => {
    e && e.stopPropagation();
    handleAmpEvent("click");

    const button = buttonRef.current.children[0].children[0];
    button && button.click();
  };

  const handleAmpEvent = (type) => {
    const { auth } = props;

    const PAYLOAD = {
      event_type: "click_create_feed_banner",
      time: +new Date(),
      user_id: auth.user ? auth.user.id && auth.user.id : null,
      event_properties: {
        interaction: auth.isLoggedIn ? "Generate My Hubs" : "Sign In",
      },
    };

    if (type == "close") {
      PAYLOAD.event_properties.interaction = "Close Banner";
    }

    sendAmpEvent(PAYLOAD);
  };

  const renderTitle = () => {
    const { auth } = props;

    return auth.isLoggedIn
      ? "Subscribe to hubs to discover all of the research papers you care about, live as they're published."
      : "Sign in to discover all of the research papers you care about, live as they're published.";
  };

  const renderButton = () => {
    const { auth, googleLogin, getUser } = props;

    return auth.isLoggedIn ? (
      <PermissionNotificationWrapper
        onClick={navigateToUserOnboardPage}
        modalMessage="create your feed"
        loginRequired={true}
        permissionKey="CreatePaper"
      >
        <Button
          isWhite={true}
          hideRipples={true}
          label={"Get Started"}
          customButtonStyle={styles.button}
          customLabelStyle={styles.buttonLabel}
        />
      </PermissionNotificationWrapper>
    ) : (
      process.browser && (
        <GoogleLoginButton
          styles={[styles.button, styles.googleLoginButton, styles.login]}
          iconStyle={styles.googleIcon}
          customLabelStyle={[styles.googleLabel]}
          googleLogin={googleLogin}
          getUser={getUser}
          customLabel={"Sign in with Google"}
          loginCallback={() => handleAmpEvent("click")}
        />
      )
    );
  };

  if (remove || loggedIn) {
    return null;
  }

  return (
    <div
      className={css(styles.column, remove && styles.remove)}
      onClick={onBannerClick}
    >
      <span className={css(styles.closeButton)} onClick={onClose}>
        {icons.times}
      </span>
      <div className={css(styles.banner)}>
        <div className={css(styles.contentContainer)}>
          <h1 className={css(styles.title)}>{renderTitle()}</h1>
          <div ref={buttonRef}>{renderButton()}</div>
        </div>
        <img
          draggable={false}
          src={"/static/icons/hubs-feed.svg"}
          className={css(styles.bannerImage)}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    position: "relative",
    cursor: "pointer",
  },
  remove: {
    display: "none",
  },
  closeButton: {
    position: "absolute",
    fontSize: 18,
    top: 10,
    right: 20,
    color: "#fff",
    cursor: "pointer",
    ":hover": {
      color: "#FAFAFA",
    },
  },
  banner: {
    display: "flex",
    justifyContent: "space-between",
    height: "min-content",
    width: "100%",
    backgroundColor: colors.NEW_BLUE(),
    margin: 0,
    boxSizing: "border-box",
    borderRadius: 4,
    border: "1px solid #ededed",
    boxShadow: "0px 0x 20px rgba(0, 0, 0, 0.25)",
    "@media only screen and (max-width: 767px)": {
      height: "min-content",
    },
  },
  contentContainer: {
    paddingLeft: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 30,
    "@media only screen and (max-width: 767px)": {
      padding: 20,
    },
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: 400,
    margin: 0,
    padding: 0,
    lineHeight: 1.3,
    marginBottom: 20,
    "@media only screen and (max-width: 767px)": {
      fontSize: 20,
      marginBottom: 20,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 17,
    },
  },
  bannerImage: {
    width: 270,
    objectFit: "contain",
    "@media only screen and (max-width: 1200px)": {
      display: "flex",
      width: "30%",
    },
    "@media only screen and (max-width: 767px)": {
      width: "40%",
    },
  },
  button: {
    width: 200,
    ":hover": {
      color: "#fff",
      backgroundColor: "#FAFAFA",
      background: "#FAFAFA",
    },
    "@media only screen and (max-width: 767px)": {
      width: "unset",
      height: 37,
    },
  },
  buttonLabel: {
    fontSize: 18,
    color: colors.NEW_BLUE(),
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  rippleClass: {
    width: "100%",
  },
  googleIcon: {
    width: 25,
    height: 25,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    borderRadius: "50%",
  },
  googleLoginButton: {
    backgroundColor: "#fff",
    border: "1px solid #fff",
    borderRadius: 4,
  },
  login: {
    border: "1px solid #E7E7E7",
    background: "#FFF",
    margin: 0,
    ":hover": {
      backgroundColor: "rgba(250, 250, 250, 1)",
    },
  },
  googleLabel: {
    color: colors.NEW_BLUE(),
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  hubs: state.hubs,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  null
)(CreateFeedBanner);
