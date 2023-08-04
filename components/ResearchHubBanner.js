import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Redux
import { AuthActions } from "~/redux/auth";

import { breakpoints } from "~/config/themes/screen";
import Login from "./Login/Login";
import Button from "./Form/Button";
import colors from "~/config/themes/colors";

class ResearchHubBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banner: true,
    };
  }

  updateUserBannerPreference = () => {
    this.props.setUserBannerPreference(false);
    this.setState({
      banner: false,
    });
  };

  render() {
    let { auth } = this.props;
    let showBanner = true;
    if (process.browser) {
      let preference = localStorage.getItem("researchhub.banner.pref");
      if (!preference || preference === "true") {
        showBanner = true && this.state.banner;
      } else {
        showBanner = false;
      }
    }

    return (
      <div
        className={css(
          styles.homeBanner,
          !showBanner && styles.hideBanner,
          !this.state.banner && styles.hideBanner
        )}
      >
        <span
          className={css(styles.closeButton)}
          onClick={this.updateUserBannerPreference}
        >
          {<FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>}
        </span>
        <img
          src={"/static/background/background-home.webp"}
          className={css(styles.bannerOverlay)}
          draggable={false}
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
            </span>
          </div>
          <div className={css(styles.subtext, styles.text)}>
            {`We are bulding an open platform and community whose goal it is to
            accelerate science. `}
            <Link href={"/about"} className={css(styles.readMore)}>
              Read more
            </Link>
          </div>
          <span style={{ marginTop: 25 }}>
            {!auth.isLoggedIn && process.browser && (
              <Login>
                <Button hideRipples={true} size="large" variant="outlined">
                  <span>Join ResearchHub</span>
                </Button>
              </Login>
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
    color: colors.WHITE(),
    fontFamily: "Roboto",
    cursor: "default",
  },
  titleContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
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
    background: `linear-gradient(${colors.SOFT_BLUE4()}, ${colors.SOFT_BLUE5()})`,
    width: "100%",
    position: "relative",
    display: "flex",
    padding: "20px 40px",
    boxSizing: "border-box",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 0,
    borderRadius: "4px",
    marginBottom: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      position: "relative",
      alignItems: "unset",
      height: "unset",
      padding: "20px 20px",
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
    color: colors.WHITE(),
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
    borderRadius: 4,
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
    color: colors.WHITE(),
    ":hover": {
      fontWeight: 400,
    },
  },
  header: {
    fontSize: 38,
    fontWeight: 400,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 32,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 26,
    },
  },
  subtext: {
    whiteSpace: "initial",
    width: 670,
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 15,
      width: "100%",
    },
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
    backgroundColor: colors.PAGE_WRAPPER,
    borderLeft: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
    backgroundColor: colors.WHITE(),
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  feedTitle: {
    display: "flex",
    alignItems: "center",
    color: colors.PURE_BLACK(),
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
    backgroundColor: colors.PAGE_WRAPPER,
    alignItems: "center",
    zIndex: 2,
    top: 65,
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

export default connect(mapStateToProps, mapDispatchToProps)(ResearchHubBanner);
