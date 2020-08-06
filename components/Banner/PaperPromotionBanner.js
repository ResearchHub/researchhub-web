import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Link from "next/link";

import { AuthActions } from "~/redux/auth";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { BannerActions } from "~/redux/banner";

import API from "~/config/api";
import { Helpers } from "~/config/helpers";
import colors from "~/config/themes/colors";

class PaperPromotionBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBanner: false,
      transition: false,
    };
  }

  componentDidMount() {
    this.showBanner();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.route !== this.props.route) {
        this.showBanner();
      }
    }
  }

  showBanner = () => {
    let blackList =
      this.props.route === "/paper/[paperId]/[tabName]" ||
      this.props.route === "/live" ||
      this.props.route === "/about" ||
      this.props.route === "/paper/upload/info";

    if (!blackList) {
      !this.state.showBanner && this.setState({ showBanner: true });
    } else {
      this.state.showBanner && this.setState({ showBanner: false });
    }
  };

  sendGAEvent = () => {
    let payload = {
      category: "Paper Promotion Banner",
      action: "Click",
      label: `Click`,
      value: 1,
      utc: new Date(),
    };

    // send first event
    fetch(API.GOOGLE_ANALYTICS({ manual: true }), API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {})
      .catch((err) => {});
  };

  render() {
    const { showBanner, transition } = this.state;

    return (
      <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/819434/summary`}>
        <a className={css(styles.removeFormat)} onClick={this.sendGAEvent}>
          <div
            className={css(
              styles.bannerContainer,
              transition && styles.transition,
              !showBanner && styles.closeBanner
            )}
          >
            <img
              className={css(styles.backgroundImage)}
              src={"/static/background/background-modal.png"}
              draggable={false}
            />
            <div className={css(styles.contentContainer)}>
              <h3 className={css(styles.content)}>
                <div>Dr. Tori Howes is hosting an AMA on her paper</div>
                <div className={css(styles.paragraph, styles.title)}>
                  When and Why Narcissists Exhibit Greater Hindsight Bias and
                  Less Perceived Learning.
                </div>
                <span
                  id={"promotionLink"}
                  className={css(styles.paragraph, styles.link)}
                >
                  Click here to ask a question!
                </span>
              </h3>
            </div>
          </div>
        </a>
      </Link>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    objectFit: "cover",
    userSelect: "none",
    zIndex: -1,
  },
  bannerContainer: {
    width: "100%",
    minWidth: "100%",
    minHeight: 60,
    maxHeight: 120,
    color: colors.BLACK(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    position: "relative",
    whiteSpace: "pre-wrap",
    cursor: "pointer",
    zIndex: 2,
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 4px 41px -24px",
    borderBottom: "rgb(151,151,151, .2) 1px solid",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
    ":hover #promotionLink": {
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
    },
  },
  contentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 25px",
  },
  content: {
    fontSize: 16,
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    "@media only screen and (max-width: 760px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 12,
    },
  },
  title: {
    fontWeight: 500,
    fontSize: 17,
    "@media only screen and (max-width: 760px)": {
      fontSize: 15,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 13,
    },
  },
  link: {
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  hovered: {
    textDecoration: "underline",
  },
  transition: {
    height: 0,
  },
  paragraph: {
    marginTop: 5,
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
  closeBanner: {
    display: "none",
  },
  removeFormat: {
    textDecoration: "unset",
    fontColor: "unset",
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
)(PaperPromotionBanner);
