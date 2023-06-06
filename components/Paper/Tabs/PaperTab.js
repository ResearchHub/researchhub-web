import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowToBottom } from "@fortawesome/pro-solid-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons";
import { faUpload } from "@fortawesome/pro-solid-svg-icons";
import { useState, useRef, Fragment, useEffect } from "react";

// NPM Modules
import { connect, useDispatch } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { useAlert } from "react-alert";
import Ripples from "react-ripples";

// Component
import Loader from "~/components/Loader/Loader";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";
import FormDND from "../../Form/FormDND";
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import Button from "../../Form/Button";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import colors from "../../../config/themes/colors";

import { defaultStyles } from "~/config/themes/styles";
import { openExternalLink, convertHttpToHttps } from "~/config/utils/routing";
import { postUpdatePaperAbstract } from "../abstract/api/postUpdatePaperAbstract";
import { useRouter } from "next/router";

function PaperTab(props) {
  const {
    paper,
    paperId,
    paperPdfRef,
    isModerator,
    updatePaperState,
    isEditorOfHubs,
    onUpdate,
  } = props;
  const alert = useAlert();
  const dispatch = useDispatch();
  const router = useRouter();

  const [file, setFile] = useState(
    (paper && (paper.file || paper.pdf_url)) || null
  ); // the path to file pdf
  const [paperUrl, setPaperUrl] = useState((paper && paper.url) || null);
  const [showDnd, toggleDnd] = useState(false); // drag and drop state toggle
  const [showConfirmation, toggleConfirmation] = useState(null); // paper from dragNdDrop
  const [loading, toggleLoading] = useState(false);
  const [paperFile, setPaperFile] = useState({});
  const containerRef = useRef();

  useEffect(() => {
    setFile(paper.file || paper.pdf_url);
    setPaperUrl(paper.url);
  }, [paper.id]);

  /**
   * @param {Array} acceptedFiles - a list containing the file that the user has uploaded
   * @param {Object} paperMetaData - a object decorated with the meta data for the file/paper the user has uploaded
   */
  function handleFileDrop(acceptedFiles, paperMetaData) {
    let paperFile = acceptedFiles[0];
    dispatch(PaperActions.uploadPaperToState(paperFile, paperMetaData));
    setPaperFile(paperFile);
  }

  function resetState() {
    toggleDnd(false);
  }

  function downloadPDF() {
    window.open(file, "_blank");
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
    let paperInReduxState = paperFile;
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
          savePdf(paperInReduxState);
        },
      });
    } else {
      return savePdf(paperInReduxState);
    }
  }

  /**
   * Makes a call to save the pdf, then removes the paper from redux state
   */
  const savePdf = async (paperFileState) => {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    let paperInReduxState = paperFileState;

    let body = {
      file: paperInReduxState.url ? paperInReduxState.url : paperInReduxState,
    };
    let paperState = await dispatch(
      PaperActions.patchPaper(paperId, body, null, null, router.query.paperName)
    );

    dispatch(MessageActions.showMessage({ show: false }));
    dispatch(MessageActions.setMessage("PDF successfully uploaded!"));
    dispatch(MessageActions.showMessage({ show: true, clickOff: true }));
    checkUserFirstTime();
    let postedPaper = paperState.payload.postedPaper;
    let paperFile = postedPaper.file ? postedPaper.file : postedPaper.url;
    setFile(paperFile);
    dispatch(PaperActions.clearPostedPaper());
    dispatch(PaperActions.removePaperFromState());
    setPaperFile({});
    onUpdate && onUpdate(paperFile);
  };

  function checkUserFirstTime() {
    let { auth } = props;
    dispatch(AuthActions.setUploadingPaper(true));
    let firstTime = !auth.user.has_seen_first_coin_modal;
    dispatch(AuthActions.checkUserFirstTime(firstTime));
  }

  function handleRenderState() {
    if (loading) {
      return (
        <div className={css(styles.loader)}>
          <Loader loading={true} size={25} />
        </div>
      );
    }
    if (file) {
      const httpsUrl = convertHttpToHttps(file);

      return (
        <div className={css(styles.pdfFrame)}>
          <iframe src={httpsUrl} height={800} width={"100%"} loading="lazy" />
        </div>
      );
    } else if (paper.oa_status && paper.oa_status === "closed") {
      return null;
    } else {
      if (showDnd) {
        return (
          <Fragment>
            <div className={css(styles.dndContainer)}>
              <FormDND
                urlView={false}
                showUrlOption={false}
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
          </Fragment>
        );
      } else {
        return (
          <Fragment>
            <div className={css(styles.emptyStateContainer)}>
              <img
                className={css(styles.emptyPlaceholderImage)}
                src={"/static/background/homepage-empty-state.png"}
                alt="Empty State"
              />
              <div className={css(styles.emptyPlaceholderText)}>
                This PDF hasn't been uploaded yet.
              </div>
              <div style={{ opacity: 0.5, fontSize: 14, marginBottom: 16 }}>
                Do not upload any copyrighted content to the site, only
                open-access content.
              </div>
              <div className={css(styles.emptyStateButtonContainer)}>
                {paperUrl && renderExternalLink()}
                <PermissionNotificationWrapper
                  onClick={() => toggleDnd(true)}
                  modalMessage="upload a paper"
                  loginRequired={true}
                  permissionKey="CreatePaper"
                >
                  <button className={css(defaultStyles.button)}>
                    Upload the Paper PDF{" "}
                    {<FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>}
                  </button>
                </PermissionNotificationWrapper>
              </div>
            </div>
          </Fragment>
        );
      }
    }
  }

  function onPdfRemove() {
    let updatedPaper = { ...paper };
    updatedPaper.file = null;
    updatePaperState && updatePaperState(updatedPaper);
    setFile(null);
    postUpdatePaperAbstract({
      paperPayload: {
        id: router.query.paperId,
        slug: router.query.paperName,
      },
    });
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
          View on External Site{" "}
          {<FontAwesomeIcon icon={faExternalLinkAlt}></FontAwesomeIcon>}
        </button>
        <div className={css(styles.emptyPlaceholderFont, styles.orText)}>
          {" or "}
        </div>
      </Fragment>
    );
  }

  function renderDownloadPdf() {
    return (
      <Button
        label={() => {
          return (
            <Fragment>
              <span className={css(styles.downloadIcon)}>
                {<FontAwesomeIcon icon={faArrowToBottom}></FontAwesomeIcon>}
              </span>
              Download
            </Fragment>
          );
        }}
        customButtonStyle={styles.button}
        customLabelStyle={styles.label}
        size={"med"}
        hideRipples={false}
        onClick={downloadPDF}
      />
    );
  }

  const renderState = handleRenderState();

  return (
    <div className={css(styles.container)} ref={containerRef}>
      {renderState && (
        <div className={css(styles.headerContainer)} ref={paperPdfRef}>
          <div className={css(styles.titleContainer)}>
            <h2>Paper PDF</h2>
            {file && renderDownloadPdf()}
          </div>
          {file && (isModerator || isEditorOfHubs) && (
            <div className={css(styles.moderatorContainer)}>
              <ModeratorDeleteButton
                actionType="pdf"
                containerStyle={styles.moderatorButton}
                icon=" "
                iconStyle={styles.iconStyle}
                isEditorOfHubs={isEditorOfHubs}
                label="Remove PDF"
                labelStyle={styles.moderatorLabel}
                metaData={{ paperId: props.paperId }}
                onRemove={onPdfRemove}
              />
            </div>
          )}
        </div>
      )}
      {handleRenderState()}
    </div>
  );
}

var styles = StyleSheet.create({
  componentWrapperStyles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: 4,
  },
  downloadIcon: {
    color: "#FFF",
    marginRight: 10,
  },
  pdfDocument: {
    width: "100%",
  },
  button: {
    whiteSpace: "nowrap",
    "@media only screen and (max-width: 767px)": {
      height: "unset",
      padding: 8,
      width: "unset",
    },
  },
  label: {
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  downloadButton: {
    alignSelf: "flex-end",
    display: "flex",
    cursor: "pointer",
    marginRight: "5%",
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
    marginLeft: 10,
    width: 100,
  },
  moderatorLabel: {
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  moderatorButton: {
    width: "unset",
    borderRadius: 3,
    color: colors.RED(),
    transition: "all ease-in-out 0.2s",
    ":hover": {
      textDecoration: "underline",
    },
  },
  iconStyle: {
    margin: 0,
    padding: 0,
  },
  dndContainer: {
    width: "100%",
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
    "@media only screen and (max-width: 767px)": {
      fontSize: 20,
      width: 380,
    },
    "@media only screen and (max-width: 500px)": {
      width: "80%",
      fontSize: 20,
    },
  },
  emptyPlaceholderSubtitle: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    textAlign: "center",
    marginBottom: 16,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      width: 280,
    },
  },
  emptyPlaceholderFont: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    textAlign: "center",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
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
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
  },
  buttonRow: {
    width: "100%",
    marginTop: 45,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cancelButton: {
    color: colors.NEW_BLUE(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: 45,
    padding: "0px 30px",
    marginRight: 30,
    borderRadius: 4,
    ":hover": {
      textDecoration: "underline",
    },
  },
  orText: {
    paddingLeft: 15,
    paddingRight: 15,
    "@media only screen and (max-width: 767px)": {
      padding: 8,
    },
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
  showPaperButton: {
    marginTop: 15,
    cursor: "pointer",
  },
  page: {
    maxWidth: "90%",
    width: "90%",
  },
  loader: {
    marginTop: 30,
  },
  pdfFrame: {
    marginTop: 20,
    width: "100%",
  },
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(PaperTab);
