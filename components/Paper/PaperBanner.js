import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import Button from "~/components/Form/Button";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";
import { PaperActions } from "~/redux/paper";

// Config
import colors, { bannerColor } from "~/config/themes/colors";
import { getSummaryText } from "~/config/utils";

const PaperBanner = ({ paper, openPaperFeatureModal, bullets }) => {
  const [type, setType] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    configureBanner();
  }, [paper.summary, bullets.bullets]);

  const configureBanner = () => {
    if (!paper) return;

    const summary = paper.summary && getSummaryText(paper.summary);
    const isRemoved = paper.is_removed;
    // const isRemoved = false;
    const needSummary = summary && summary.trim().length < 250;
    const needTakeaways = bullets.bullets.length < 3;

    if (isRemoved) {
      setType("removed");
      return setShowBanner(true);
    }

    if (needSummary || needTakeaways) {
      setType("incomplete");
      return setShowBanner(true);
    }

    setShowBanner(false);
  };

  const renderButton = () => {
    const props = {};
    const summary = paper.summary && getSummaryText(paper.summary);
    const takeaways = bullets.bullets.length;

    if (summary && summary.trim().length < 250) {
      props.label = "Add Summary";
      props.onClick = () => openPaperFeatureModal(true, { tab: "summary" });
    } else if (takeaways < 3) {
      props.label = "Add Key Takeaway";
      props.onClick = () =>
        openPaperFeatureModal(true, { tab: "key-takeaways" });
      props.customButtonStyle = styles.button;
      props.customLabelStyle = styles.buttonLabel;
    }

    return (
      <div className={css(styles.buttonContainer)}>
        <Button {...props} />
      </div>
    );
  };

  /**
   * RENDERING
   */
  const renderMessage = () => {
    switch (type) {
      case "removed":
        return (
          <div style={{ textAlign: "left", width: "100%", marginLeft: 25 }}>
            <h3 className={css(styles.header)}>Paper Content Removed</h3>
            This paper has been removed for having poor quality content and not
            adhering to guidelines.
            <br />
            Please visit our{" "}
            <a
              style={{ color: "#4E53FF" }}
              href="https://www.notion.so/researchhub/Paper-Submission-Guidelines-a2cfa1d9b53c431a91c9816e17f212e1"
              target="_blank"
            >
              Paper Submission Guidelines
            </a>{" "}
            to review our standard.
          </div>
        );
      case "incomplete":
        return (
          <div style={{ textAlign: "left", width: "100%", minHeight: 120 }}>
            <h3 className={css(styles.header)}>
              Help improve the quality of this page.
            </h3>
            You can improve this paper page by contributing content.
            {renderButton()}
          </div>
        );
      default:
        return;
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "removed":
        return (
          <i
            className={css(styles.removeIcon) + " fas fa-exclamation-circle"}
          />
        );
      case "incomplete":
        return (
          <img
            className={css(styles.incompleteIcon)}
            src={"/static/icons/rh-group.png"}
          />
        );
      default:
        return;
    }
  };

  return (
    <div
      className={css(
        styles.banner,
        type === "removed" ? styles.removed : styles.incomplete,
        !showBanner && styles.hideBanner
      )}
    >
      {type === "removed" && (
        <div className={css(styles.icon)}>{renderIcon()}</div>
      )}
      <div className={css(styles.message)}>{renderMessage()}</div>
      {type === "incomplete" && (
        <div className={css(styles.icon)}>{renderIcon()}</div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    padding: "15px 30px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.9)",
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
    padding: 0,
    margin: 0,
    fontSize: 18,
    fontWeight: 500,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
  },
  message: {
    width: "100%",
    lineHeight: 1.8,
    fontSize: 16,
    fontWeight: 400,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  icon: {
    fontSize: "2em",
  },
  removeIcon: {
    color: colors.RED(),
    fontSize: "2em",
    "@media only screen and (max-width: 767px)": {
      fontSize: "1em",
    },
  },
  incompleteIcon: {
    color: "unset",
    height: 120,
    "@media only screen and (max-width: 767px)": {
      height: 90,
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
      height: 90,
      fontSize: 12,
    },
  },
  buttonLabel: {
    fontSize: 10,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperBanner);
