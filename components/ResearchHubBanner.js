import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import "react-placeholder/lib/reactPlaceholder.css";
import Link from "next/link";

// Components
import GoogleLoginButton from "~/components/GoogleLoginButton";

// Redux
import { AuthActions } from "~/redux/auth";

class ResearchHubBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileBanner: false,
    };
  }

  updateDimensions = () => {
    if (window.innerWidth < 968) {
      this.setState({
        mobileBanner: window.innerWidth < 580 ? true : false,
      });
    } else {
      this.setState({ mobileBanner: false });
    }
  };

  updateUserBannerPreference = () => {
    this.props.setUserBannerPreference(false);
    this.setState({
      banner: false,
    });
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    this.setState({
      browser: true,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    let { auth } = this.props;
    let showBanner = true;
    let preference = localStorage.getItem("researchhub.banner.pref");
    if (!preference || preference === "true") {
      showBanner = true;
    } else {
      showBanner = false;
    }

    return (
      <div className={css(styles.homeBanner, !showBanner && styles.hideBanner)}>
        <span
          className={css(styles.closeButton)}
          onClick={this.updateUserBannerPreference}
        >
          <i className="fal fa-times" />
        </span>
        <img
          src={
            this.state.mobileBanner
              ? "/static/background/background-home-mobile.png"
              : "/static/background/background-home.jpg"
          }
          className={css(styles.bannerOverlay)}
        />
        <div
          className={css(
            styles.column,
            styles.titleContainer,
            auth.isLoggedIn && styles.centered
          )}
        >
          <div className={css(styles.header, styles.text)}>
            Welcome to{" "}
            <span className={css(styles.hubName)}>
              {this.props.all || this.props.home
                ? "ResearchHub"
                : this.props.hub.name}
              !
            </span>
          </div>
          <div className={css(styles.subtext, styles.text)}>
            We're a community seeking to improve prioritization, collaboration,
            reproducibility, and funding of scientific research.{" "}
            <Link href={"/about"}>
              <a className={css(styles.readMore)}>Read more</a>
            </Link>
          </div>
          {this.props.banners.showSignupBanner && (
            <div className={css(styles.subtext, styles.promo, styles.text)}>
              Join today for 25 RSC
              <img
                className={css(styles.coinIcon)}
                src={"/static/icons/coin-filled.png"}
              />
            </div>
          )}
          <span className={css(styles.googleLogin)}>
            {!auth.isLoggedIn && (
              <GoogleLoginButton
                styles={styles.googleLoginButton}
                googleLogin={this.props.googleLogin}
                getUser={this.props.getUser}
                customLabel={"Sign in with Google"}
              />
            )}
          </span>
        </div>
      </div>
    );
  }
}

var styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#FFF",
    fontFamily: "Roboto",
    cursor: "default",
  },
  titleContainer: {
    alignItems: "flex-start",
    marginLeft: "calc(100% * .08)",
    justifyContent: "space-between",
    height: 200,
    zIndex: 2,
    "@media only screen and (max-width: 767px)": {
      height: "unset",
      justifyContent: "flex-start",
    },
  },
  centered: {
    height: 120,
  },
  placeholder: {
    marginTop: 16,
  },
  placeholderBottom: {
    marginTop: 16,
  },
  homeBanner: {
    background: "linear-gradient(#684ef5, #4d58f6)",
    width: "100%",
    height: 320,
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 0,
    "@media only screen and (max-width: 767px)": {
      position: "relative",
      alignItems: "unset",
      height: "unset",
    },
  },
  showBanner: {
    display: "flex",
  },
  hideBanner: {
    display: "none",
  },
  closeButton: {
    position: "absolute",
    cursor: "pointer",
    fontSize: 26,
    top: 20,
    right: 50,
    color: "white",
    zIndex: 3,
    "@media only screen and (max-width: 580px)": {
      right: 20,
      top: 15,
      fontSize: 20,
    },
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    objectFit: "cover",
    height: "100%",
    width: "100%",
    minWidth: "100%",
    zIndex: 2,
    "@media only screen and (max-width: 577px)": {
      objectFit: "cover",
      position: "absolute",
      height: 180,
      bottom: 0,
      right: 0,
    },
    "@media only screen and (max-width: 967px)": {
      display: "none",
    },
  },
  readMore: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#FFF",
    ":hover": {
      fontWeight: 400,
    },
  },
  header: {
    fontSize: 50,
    fontWeight: 400,
    "@media only screen and (max-width: 685px)": {
      fontSize: 40,
    },
    "@media only screen and (max-width: 577px)": {
      fontSize: 25,
      marginTop: 16,
      width: 300,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  subtext: {
    whiteSpace: "initial",
    width: 670,
    fontSize: 16,
    fontWeight: 300,
    "@media only screen and (max-width: 799px)": {
      fontSize: 15,
      width: "100%",
    },
    "@media only screen and (max-width: 577px)": {
      fontSize: 16,
      width: 305,
      marginTop: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  googleLogin: {
    "@media only screen and (max-width: 767px)": {
      marginBottom: 18,
    },
  },
  googleLoginButton: {
    border: "1px solid #fff",
  },
  button: {
    height: 55,
    width: 230,
    marginTop: 10,
    marginBottom: 0,
  },
  iconStyle: {
    height: 33,
    width: 33,
  },
  promo: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  coinIcon: {
    height: 20,
    marginLeft: 8,
    "@media only screen and (max-width: 760px)": {
      height: 18,
    },
    "@media only screen and (max-width: 415px)": {
      height: 16,
    },
  },
  /**
   * MAIN FEED STYLES
   */
  mainFeed: {
    height: "100%",
    width: "85%",
    backgroundColor: "#FCFCFC",
    borderLeft: "1px solid #ededed",
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  feedTitle: {
    display: "flex",
    alignItems: "center",
    color: "#000",
    fontWeight: "400",
    fontSize: 33,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 1343px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 20,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 22,
      fontWeight: 500,
      marginBottom: 10,
    },
    "@media only screen and (max-width: 416px)": {
      fontWeight: 400,
      fontSize: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  topbar: {
    paddingTop: 30,
    width: "calc(100% - 140px)",
    position: "sticky",
    paddingLeft: 70,
    paddingRight: 70,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    zIndex: 2,
    top: 80,
    "@media only screen and (max-width: 767px)": {
      position: "relative",
      top: 0,
    },
    "@media only screen and (max-width: 665px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingBottom: 20,
    },
    "@media only screen and (max-width: 577px)": {
      paddingLeft: 40,
      paddingRight: 40,
      width: "calc(100% - 80px)",
    },
  },
  dropDown: {
    width: 150,
    height: 45,
    "@media only screen and (max-width: 1343px)": {
      height: "unset",
    },
    "@media only screen and (max-width: 1149px)": {
      width: 150,
    },
    "@media only screen and (max-width: 895px)": {
      width: 125,
    },
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      height: 45,
      margin: "10px 0px 10px 0px",
    },
    "@media only screen and (max-width: 375px)": {
      width: 345,
    },
    "@media only screen and (max-width: 321px)": {
      width: 300,
    },
  },
  inputs: {
    width: 320,
    "@media only screen and (max-width: 1149px)": {
      width: 320,
    },
    "@media only screen and (max-width: 895px)": {
      width: 270,
    },
    "@media only screen and (max-width: 665px)": {
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  },
  hubName: {
    textTransform: "capitalize",
    marginRight: 13,
    "@media only screen and (max-width: 1343px)": {
      marginRight: 8,
    },
    "@media only screen and (max-width: 1149px)": {
      marginRight: 5,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  isLoggedIn: state.auth.isLoggedIn,
  banners: state.banners,
});

const mapDispatchToProps = {
  googleLogin: AuthActions.googleLogin,
  getUser: AuthActions.getUser,
  setUserBannerPreference: AuthActions.setUserBannerPreference,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchHubBanner);
