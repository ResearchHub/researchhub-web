import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

import { RHLogo } from "~/config/themes/icons";
import GoogleLoginButton from "../GoogleLoginButton";

import { BannerActions } from "~/redux/banner";

class SignUpOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reveal: false,
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
    }
  }

  showBanner = () => {
    this.setState({ reveal: true });
  };

  renderDivider = () => {
    return (
      <div className={css(styles.row, styles.divider)}>
        <div className={css(styles.line)} />
        <div className={css(styles.lineText)}>or</div>
        <div className={css(styles.line)} />
      </div>
    );
  };

  closeBanner = () => {
    this.setState({ reveal: false });
    this.props.removeBanner();
  };

  render() {
    const { reveal } = this.state;
    return (
      <Fragment>
        {reveal ? (
          <div onClick={this.closeBanner} className={css(styles.overlay)}>
            <div
              className={css(styles.modal)}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={"/static/icons/close.png"}
                className={css(styles.closeButton)}
                onClick={this.closeBanner}
                draggable={false}
              />
              <RHLogo iconStyle={styles.logo} />
              <div className={css(styles.title)}>Welcome to the community!</div>
              <div className={css(styles.modalBody)}>
                <div className={css(styles.subtitle)}>
                  Join today and earn 25 RSC
                  <img
                    className={css(styles.coinIcon)}
                    src={"/static/icons/coin-filled.png"}
                  />
                </div>
                <div className={css(styles.googleButton)}>
                  <GoogleLoginButton
                    customLabel={"Sign in with Google"}
                    loginCallback={this.closeBanner}
                  />
                </div>
                {this.renderDivider()}
                <div className={css(styles.loginContainer)}>
                  {"Already a member? "}
                  <GoogleLoginButton
                    customLabel={"Sign in"}
                    hideButton={true}
                    loginCallback={this.closeBanner}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: "3",
    borderRadius: 5,
    minHeight: "100%",
    minWidth: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    opacity: 1,
  },
  modal: {
    background: "#fff",
    outline: "none",
    position: "sticky",
    marginTop: 40,
    top: 180,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 5,
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 600,
    padding: 25,
  },
  title: {
    paddingTop: 20,
    fontSize: 24,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  titleText: {},
  coinIcon: {
    height: 20,
    marginLeft: 8,
  },
  logo: {
    width: 120,
    objectFit: "contain",
  },
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  divider: {
    padding: "20px 0px",
    boxSizing: "border-box",
    justifyContent: "space-between",
  },
  line: {
    backgroundColor: "#DBDBDB",
    height: 1,
    width: "42%",
  },
  lineText: {
    color: "#8E8E8E",
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: 600,
  },
  googleButton: {
    marginTop: 20,
  },
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 15,
    whiteSpace: "pre-wrap",
    cursor: "default",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 20,
    right: 20,
    cursor: "pointer",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  banners: state.banners,
});

const mapDispatchToProps = {
  removeBanner: BannerActions.removeBanner,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpOverlay);
