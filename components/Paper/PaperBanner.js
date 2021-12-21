import { connect } from "react-redux";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import { MessageActions } from "~/redux/message";
import { ModalActions } from "../../redux/modals";
import { StyleSheet, css } from "aphrodite";
import { upCaseFirstLetter } from "~/config/utils/upCaseFirstLetter";
import colors, { bannerColor } from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const PaperBanner = (props) => {
  const { document, documentType } = props;
  const doneFetching = !isEmpty(document);
  const currDocumentState = Boolean(document?.is_removed) ? "removed" : null;
  const isRemoved = currDocumentState === "removed";
  const shouldShowBanner =
    doneFetching && !isNullOrUndefined(currDocumentState);

  const renderMessage = () => {
    switch (currDocumentState) {
      case "removed":
        return (
          <div className={css(styles.removedMessage)}>
            <h3 className={css(styles.header)}>
              <div className={css(styles.icon)}>
                <span
                  className={css(styles.removeIcon, styles.mobileRemoveIcon)}
                >
                  {icons.exclamationCircle}
                </span>
              </div>
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

  return (
    <div
      className={css(
        styles.banner,
        isRemoved ? styles.removed : styles.incomplete,
        !shouldShowBanner && styles.hideBanner
      )}
    >
      <div className={css(styles.bannerInner)}>
        {isRemoved && (
          <div className={css(styles.icon)}>
            <span className={css(styles.removeIcon)}>
              {icons.exclamationCircle}
            </span>
          </div>
        )}
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
