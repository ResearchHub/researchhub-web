import { useState, useEffect, Fragment } from "react";

// NPM Modules
import { connect, useStore, useDispatch } from "react-redux";
import { withRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { Document, Page, pdfjs } from "react-pdf";
import { isMobile } from "react-device-detect";
import { useAlert } from "react-alert";
import Ripples from "react-ripples";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Component
import Loader from "~/components/Loader/Loader";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";
import ComponentWrapper from "~/components/ComponentWrapper";
import NewDND from "../../Form/NewDND";
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import Button from "../../Form/Button";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import colors from "../../../config/themes/colors";
import icons from "~/config/themes/icons";
import { defaultStyles } from "~/config/themes/styles";
import { openExternalLink } from "~/config/utils";

function PaperTab(props) {
  const { paper, paperId } = props;
  const alert = useAlert();
  const store = useStore();
  const dispatch = useDispatch();

  const [loadSuccess, setLoadSuccess] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [file, setFile] = useState((paper && paper.file) || null); // the path to file pdf
  const [paperUrl, setPaperUrl] = useState((paper && paper.url) || null);
  const [showDnd, toggleDnd] = useState(false); // drag and drop state toggle
  const [showConfirmation, toggleConfirmation] = useState(null); // paper from dragNdDrop

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoadSuccess(true);
  }

  /**
   * @param {Array} acceptedFiles - a list containing the file that the user has uploaded
   * @param {Object} paperMetaData - a object decorated with the meta data for the file/paper the user has uploaded
   */
  function handleFileDrop(acceptedFiles, paperMetaData) {
    let paperFile = acceptedFiles[0];
    dispatch(PaperActions.uploadPaperToState(paperFile, paperMetaData));
  }

  function resetState() {
    toggleDnd(false);
  }

  function checkSearchResults(searchResults) {
    if (searchResults.length) {
      return !showConfirmation && toggleConfirmation(true);
    }
    showConfirmation && toggleConfirmation(false);
  }

  /**
   * Shows a confirmation to the user if there are 1 or more "similar papers" found in search
   */
  function confirmSave() {
    let paperInReduxState = store.getState().paper.uploadedPaper;
    if (!Object.keys(paperInReduxState).length) {
      dispatch(MessageActions.setMessage("Add a PDF to upload"));
      return dispatch(
        MessageActions.showMessage({ show: true, clickOff: true, error: true })
      );
    }

    if (showConfirmation) {
      return alert.show({
        text: "Are you sure this is the PDF for the paper?",
        buttonText: "Yes",
        onClick: () => {
          savePdf();
        },
      });
    } else {
      return savePdf();
    }
  }

  /**
   * Makes a call to save the pdf, then removes the paper from redux state
   */
  async function savePdf() {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    let paperInReduxState = store.getState().paper.uploadedPaper;
    let body = {
      file: paperInReduxState.url ? paperInReduxState.url : paperInReduxState,
    };
    await dispatch(PaperActions.patchPaper(paperId, body));
    let paperState = store.getState().paper;

    if (paperState.success) {
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("PDF successfully uploaded!"));
      dispatch(MessageActions.showMessage({ show: true, clickOff: true }));
      checkUserFirstTime();
      let postedPaper = paperState.postedPaper;
      let paperFile = postedPaper.file ? postedPaper.file : postedPaper.url;
      setFile(paperFile);
      dispatch(PaperActions.clearPostedPaper());
      dispatch(PaperActions.removePaperFromState());
    } else {
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("Something went wrong."));
      dispatch(
        MessageActions.showMessage({ show: true, clickOff: true, error: true })
      );
    }
  }

  function checkUserFirstTime() {
    let auth = store.getState().auth;
    dispatch(AuthActions.setUploadingPaper(true));
    let firstTime = !auth.user.has_seen_first_coin_modal;
    dispatch(AuthActions.checkUserFirstTime(firstTime));
  }

  function handleRenderState() {
    if (file) {
      return (
        <Document
          // className={css(!loadSuccess && styles.hidden)}
          file={file}
          onLoadSuccess={onLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              pageNumber={index + 1}
              width={
                isMobile && window.innerWidth < 1000 ? window.innerWidth : 1000
              }
              key={`page_${index + 1}`}
            />
          ))}
        </Document>
      );
    } else {
      if (showDnd) {
        return (
          <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
            <div className={css(styles.dndContainer)}>
              <NewDND
                handleDrop={handleFileDrop}
                onSearch={checkSearchResults}
              />
              <div className={css(styles.buttonRow)}>
                <Ripples
                  className={css(styles.cancelButton)}
                  onClick={resetState}
                >
                  Cancel
                </Ripples>
                <Button label={"Save PDF"} onClick={confirmSave} />
              </div>
            </div>
          </ComponentWrapper>
        );
      } else {
        return (
          <ComponentWrapper>
            <div className={css(styles.emptyStateContainer)}>
              <img
                className={css(styles.emptyPlaceholderImage)}
                src={"/static/background/homepage-empty-state.png"}
              />
              <div className={css(styles.emptyPlaceholderText)}>
                This academic paper hasn't been uploaded yet
              </div>
              <div className={css(styles.emptyPlaceholderSubtitle)}>
                {paperUrl && "View the paper now by clicking the link below"}
                {!paperUrl && "Click ‘Upload PDF’ button to add the paper"}
              </div>
              <div className={css(styles.emptyStateButtonContainer)}>
                {paperUrl && renderExternalLink()}
                <PermissionNotificationWrapper
                  onClick={() => toggleDnd(true)}
                  modalMessage="upload a paper"
                  loginRequired={true}
                  permissionKey="CreatePaper"
                >
                  <Button label={"Upload PDF"} hideRipples={true} />
                </PermissionNotificationWrapper>
              </div>
            </div>
          </ComponentWrapper>
        );
      }
    }
  }

  function renderExternalLink() {
    return (
      <Fragment>
        <button
          className={css(defaultStyles.secondaryButton)}
          onClick={() => {
            openExternalLink(paperUrl);
          }}
        >
          View on External Site {icons.externalLink}
        </button>
        <div className={css(styles.emptyPlaceholderFont, styles.orText)}>
          {" or "}
        </div>
      </Fragment>
    );
  }

  return (
    <div className={css(styles.container)}>
      {file && (
        <ComponentWrapper>
          <div className={css(styles.moderatorContainer)}>
            <ModeratorDeleteButton
              label={`Remove PDF`}
              labelStyle={styles.moderatorLabel}
              containerStyle={styles.moderatorButton}
              actionType={"pdf"}
              metaData={{ paperId: props.paperId }}
              onRemove={() => setFile(null)}
              icon={" "}
              iconStyle={styles.iconStyle}
            />
          </div>
        </ComponentWrapper>
      )}
      {handleRenderState()}
    </div>
  );
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  pageNavigator: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
    cursor: "pointer",
    fontSize: 20,
  },
  disable: {
    opacity: 0.3,
  },
  hidden: {
    opacity: 0,
  },
  moderatorContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  moderatorLabel: {},
  moderatorButton: {
    padding: "10px 16px",
    width: "unset",
    border: `1px solid ${colors.RED()}`,
    borderRadius: 3,
    color: colors.RED(),
    transition: "all ease-in-out 0.2s",
    ":hover": {
      background: colors.RED(),
      color: "#fff",
    },
  },
  iconStyle: {
    margin: 0,
    padding: 0,
  },
  componentWrapperStyles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dndContainer: {
    width: 600,
    marginTop: 30,
    "@media only screen and (max-width: 700px)": {
      width: "100%",
    },
  },
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
  },
  emptyPlaceholderImage: {
    width: 300,
    "@media only screen and (max-width: 320px)": {
      width: 250,
    },
    //Todo: check for responsiveness
  },
  emptyPlaceholderText: {
    fontSize: 20,
    fontWeight: 500,
    color: colors.BLACK(),
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 13,
    },
  },
  emptyPlaceholderSubtitle: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    textAlign: "center",
    marginBottom: 20,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 10,
    },
  },
  emptyPlaceholderFont: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 10,
    },
  },
  emptyStateButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    verticalAlign: "center",
    flexFlow: "row wrap",
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
    },
  },
  externalLinkText: {
    paddingTop: 20,
    fontSize: 16,
    color: colors.PURPLE(),
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 320px)": {
      fontSize: 10,
    },
  },
  buttonRow: {
    width: "100%",
    marginTop: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    color: colors.BLUE(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: 45,
    padding: "0px 30px",
    marginRight: 30,
    borderRadius: 4,
    // paddingLeft: 0,
    ":hover": {
      textDecoration: "underline",
    },
  },
  orText: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});

const mapStateToProps = (state) => ({
  paperUrl: state.paper.file,
});

export default withRouter(connect(mapStateToProps)(PaperTab));
