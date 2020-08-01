import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";

import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { BannerActions } from "~/redux/banner";

import colors from "~/config/themes/colors";
import { GOOGLE_CLIENT_ID } from "~/config/constants";

class SignUpBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBanner: false,
      transition: false,
    };
  }

  componentDidMount() {
    let { isLoggedIn } = this.props.auth;
    let { showSignupBanner } = this.props.banners;
    !isLoggedIn && showSignupBanner && this.showBanner();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (
        prevProps.auth.isLoggedIn !== this.props.isLoggedIn &&
        prevProps.auth.authChecked !== this.props.auth.useDispatch
      ) {
        let { isLoggedIn } = this.props.auth;
        let { showSignupBanner } = this.props.banners;
        !isLoggedIn && showSignupBanner && this.showBanner();
      }
      if (prevProps.route !== this.props.route) {
        let { isLoggedIn } = this.props.auth;
        let { showSignupBanner } = this.props.banners;
        !isLoggedIn && showSignupBanner && this.showBanner();
      }
    }
  }

  showBanner = () => {
    let onHome =
      this.props.route === "/" ||
      this.props.route === "/hubs/[slug]" ||
      this.props.route === "/live";
    if (!onHome || localStorage.getItem("researchhub.banner.pref") !== "true") {
      this.setState({ showBanner: true });
    } else {
      this.setState({ showBanner: false });
    }
  };

  closeBanner = (e) => {
    e && e.stopPropagation();
    this.setState(
      {
        transition: true,
      },
      () => {
        setTimeout(() => {
          this.props.removeBanner();
          this.setState({ transition: false, showBanner: false });
        }, 400);
      }
    );
  };

  responseGoogle = async (response) => {
    let { googleLogin, getUser } = this.props;
    response["access_token"] = response["accessToken"];

    await googleLogin(response).then((action) => {
      if (action.loginFailed) {
        showLoginFailureMessage();
      } else {
        getUser().then((userAction) => {
          this.closeBanner(); // close the banner and set preference
          if (!userAction.user.has_seen_orcid_connect_modal) {
            this.props.openOrcidConnectModal(true);
          }
        });
      }
    });
  };

  navigateRSCNotion = () => {
    let url =
      "https://www.notion.so/ResearchCoin-21d1af8428824915a4d1f7c0b6b77cb4";
    window.open(url, "_blank");
  };

  showLoginFailureMessage = (response) => {
    console.error(response);
    this.props.setMessage("Login failed");
    this.props.showMessage({ show: true, error: true });
  };

  render() {
    const { showBanner, transition } = this.state;

    return (
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        onSuccess={this.responseGoogle}
        onFailure={this.showLoginFailureMessage}
        cookiePolicy={"single_host_origin"}
        render={(renderProps) => {
          return (
            <div
              className={css(
                styles.bannerContainer,
                transition && styles.transition,
                !showBanner && styles.closeBanner
              )}
              disabled={renderProps.disabled}
              onClick={renderProps.onClick}
            >
              Join today and earn 25 RSC
              <img
                className={css(styles.coinIcon)}
                src={"/static/icons/coin-filled.png"}
              />
              <div
                className={css(styles.flexContainer)}
                onClick={this.navigateRSCNotion}
              >
                What is ResearchCoin?
              </div>
              <div
                className={css(styles.closeButton)}
                onClick={this.closeBanner}
              >
                <i className="fal fa-times" />
              </div>
            </div>
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: "100%",
    height: 60,
    backgroundColor: colors.BLUE(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#FFF",
    userSelect: "none",
    position: "relative",
    whiteSpace: "pre-wrap",
    cursor: "pointer",
    transition: "all ease-in-out 0.2s",
    "@media only screen and (max-width: 760px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
      height: 70,
    },
  },
  transition: {
    height: 0,
  },
  flexContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      marginTop: 5,
    },
    ":hover": {
      textDecoration: "underline",
    },
  },
  coinIcon: {
    height: 20,
    marginLeft: 8,
    marginRight: 8,
    "@media only screen and (max-width: 760px)": {
      height: 18,
    },
    "@media only screen and (max-width: 415px)": {
      height: 16,
    },
  },
  closeButton: {
    position: "absolute",
    color: "#FFF",
    right: 30,
    fontSize: 20,
    cursor: "pointer",
    "@media only screen and (max-width: 760px)": {
      right: 20,
    },
    "@media only screen and (max-width: 415px)": {
      top: 10,
    },
  },
  closeBanner: {
    display: "none",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  banners: state.banners,
});

const mapDispatchToProps = {
  removeBanner: BannerActions.removeBanner,
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
  openOrcidConnectModal: ModalActions.openOrcidConnectModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpBanner);
