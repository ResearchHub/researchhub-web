import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import icons from "~/config/themes/icons";
import colors, { bannerColor } from "~/config/themes/colors";
import { upCaseFirstLetter } from "~/config/utils/upCaseFirstLetter";

const PaperBanner = (props) => {
  // TODO: calvinhlee - refactor this component.
  const { paper, fetchBullets, loadingPaper, post, postType, lastFetchTime } =
    props;
  const [type, setType] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    configureBanner();
  }, [paper, loadingPaper, post, lastFetchTime]);

  const documentType = Boolean(paper) ? "paper" : postType;
  const configureBanner = () => {
    if (documentType === "post" || documentType === "hypothesis") {
      if (!post || Object.keys(post).length === 0) {
        setShowBanner(false);
        return;
      } else if (!post.is_removed) {
        setShowBanner(false);
        return;
      }
    } else {
      if (!paper) {
        setShowBanner(false);
        return;
      } else {
        if (!Boolean(paper?.is_removed) && (!fetchBullets || loadingPaper)) {
          setShowBanner(false);
          return;
        }
      }
    }
    const isRemoved =
      documentType === "post" || "hypothesis"
        ? Boolean(post?.is_removed)
        : Boolean(paper?.is_removed);

    if (isRemoved) {
      setType("removed");
      setShowBanner(true);
      return;
    }

    setShowBanner(false);
  };

  /**
   * RENDERING
   */
  const renderMessage = () => {
    switch (type) {
      case "removed":
        return (
          <div className={css(styles.removedMessage)}>
            <h3 className={css(styles.header)}>
              {renderIcon(true)}
              {upCaseFirstLetter(documentType)} Removed
            </h3>
            {`This ${documentType} has been removed by the submitter or for having
            poor quality content and not adhering to guidelines. `}
            <br />
            {"Please visit our "}
            <a
              style={{ color: "#4E53FF" }}
              href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
              target="_blank"
              rel="noreferrer noopener"
            >
              {`${documentType} Submission Guidelines`}
            </a>
            {" to review our standard."}
          </div>
        );
      default:
        return;
    }
  };

  const renderIcon = (mobile) => {
    let icon;

    switch (type) {
      case "removed":
        icon = (
          <span
            className={css(
              styles.removeIcon,
              mobile && styles.mobileRemoveIcon
            )}
          >
            {icons.exclamationCircle}
          </span>
        );
        break;
      default:
        break;
    }

    return <div className={css(styles.icon)}>{icon}</div>;
  };

  const conditionalContainer = ({ mobile = false, condition, component }) => {
    return condition ? (
      <div className={css(styles.desktop, mobile && styles.mobile)}>
        {component}
      </div>
    ) : null;
  };

  return (
    <div
      className={css(
        styles.banner,
        type === "removed" ? styles.removed : styles.incomplete,
        !showBanner && styles.hideBanner
      )}
    >
      <div className={css(styles.bannerInner)}>
        {type === "removed" && renderIcon()}
        <div className={css(styles.message)}>{renderMessage()}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    padding: "15px 30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.9)",
    "@media only screen and (max-width: 767px)": {
      padding: "15px 20px",
    },
    "@media only screen and (max-width: 415px)": {
      padding: 15,
    },
  },
  bannerInner: {
    display: "flex",
    "@media only screen and (min-width: 768px)": {
      width: "80%",
      margin: "0 auto",
    },
  },
  desktop: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "unset",
    },
  },
  removed: {
    background: bannerColor.GREY,
  },
  incomplete: {
    background: bannerColor.BLUE,
  },
  hideBanner: {
    display: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    margin: 0,
    fontSize: 18,
    fontWeight: 500,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 15,
      marginBottom: 5,
    },
  },
  paragraph: {
    padding: 0,
    margin: 0,
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
    "@media only screen and (max-width: 415px)": {
      maxWidth: "max-content",
      lineBreak: "normal",
    },
  },
  message: {
    width: "100%",
    lineHeight: 1.8,
    fontSize: 16,
    fontWeight: 400,
    paddingRight: 30,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 415px)": {
      paddingRight: 0,
    },
  },
  incompleteMessage: {
    textAlign: "left",
    width: "100%",
    minHeight: 120,
    "@media only screen and (max-width: 767px)": {
      marginLeft: 25,
      lineHeight: 1.3,
      minHeight: "unset",
    },
    "@media only screen and (max-width: 415px)": {
      width: "fit-content",
      marginLeft: 15,
    },
  },
  removedMessage: {
    textAlign: "left",
    width: "100%",
    marginLeft: 25,
    "@media only screen and (max-width: 767px)": {
      marginLeft: 14,
      lineHeight: 1.5,
    },
    "@media only screen and (max-width: 415px)": {
      marginLeft: 10,
      marginRight: 10,
    },
  },
  icon: {},
  removeIcon: {
    color: colors.RED(),
    fontSize: "4em",
    "@media only screen and (max-width: 767px)": {
      fontSize: "2.5em",
    },
    "@media only screen and (max-width: 415px)": {
      display: "none",
    },
  },
  incompleteIcon: {
    color: "unset",
    height: 120,
    "@media only screen and (max-width: 767px)": {
      height: 90,
    },
    "@media only screen and (max-width: 415px)": {
      height: 70,
    },
  },
  mobileRemoveIcon: {
    display: "none",
    "@media only screen and (max-width: 415px)": {
      display: "unset",
      fontSize: 16,
      marginRight: 5,
    },
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    maxWidth: "unset",
    width: "unset",
    paddingLeft: 15,
    paddingRight: 15,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
      height: 35,
    },
    "@media only screen and (max-width: 415px)": {
      height: 30,
    },
  },
  buttonLabel: {
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
      height: "unset",
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  bullets: state.bullets,
});

const mapDispatchToProps = {
  openPaperFeatureModal: ModalActions.openPaperFeatureModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaperBanner);
