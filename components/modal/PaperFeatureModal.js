import React from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";
import { Value } from "slate";
import { withAlert } from "react-alert";

import BaseModal from "./BaseModal";
import FormTextArea from "../Form/FormTextArea";
import Button from "../Form/Button";
import Loader from "~/components/Loader/Loader";
import TextEditor from "~/components/TextEditor";
import NewDND from "~/components/Form/NewDND";

// Redux
import { BulletActions } from "~/redux/bullets";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";
import { LimitationsActions } from "~/redux/limitations";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import { thread } from "~/redux/discussion/shims";
import { isQuillDelta } from "~/config/utils/";
import { sendAmpEvent } from "~/config/fetch";

const BULLET_COUNT = 5;
const LIMITATIONS_COUNT = 5;

class PaperFeatureModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      keyTakeawayText: "",
      limitationText: "",
      pendingSubmission: false,
      summaryEditorState: null,
      commentEditorState: null,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    let { props, isOpen } = this.props.modals.openPaperFeatureModal;
    if (props.tab === "summary") {
      let { paper } = this.props;
      let editorStateItem = localStorage.getItem(
        `editorState-${paper.id}-${paper.summary && paper.summary.id}`
      );
      if (editorStateItem) {
        let editorState = Value.fromJSON(JSON.parse(editorStateItem));
        this.setState({
          summaryEditorState: editorState,
        });
      } else {
        this.initializeSummary();
      }
    }
  }

  componentDidUpdate(prevProps) {
    let { props, isOpen } = this.props.modals.openPaperFeatureModal;
    if (
      !prevProps.modals.openPaperFeatureModal.isOpen &&
      (isOpen && props.tab === "summary")
    ) {
      this.initializeSummary();
    }
  }

  /**
   * Initializes the summary from the paper redux
   */
  initializeSummary = () => {
    const { paper } = this.props;
    if (paper.summary) {
      if (paper.summary.summary) {
        if (isQuillDelta(paper.summary.summary)) {
          return this.setState({ summaryEditorState: paper.summary.summary });
        }
        let summaryJSON = paper.summary.summary;
        let editorState = Value.fromJSON(summaryJSON);
        this.setState({
          summaryEditorState: editorState,
        });
      }
    }
  };

  closeModal = () => {
    this.props.openPaperFeatureModal(false, {});
    this.setState({ ...this.initialState });
    document.body.style.overflow = "scroll";
  };

  handleText = (id, value) => {
    this.setState({ [id]: value });
  };

  handleDiscussionTextEditor = (editorState) => {
    this.setState({ commentEditorState: editorState });
  };

  transitionWrapper = (fn) => {
    this.setState({ transition: true }, () => {
      setTimeout(() => {
        fn();
        this.setState({ transition: false });
      }, 400);
    });
  };

  renderTitle = () => {
    let { props, isOpen } = this.props.modals.openPaperFeatureModal;

    if (props) {
      switch (props.tab) {
        case "key-takeaways":
          return "Add Key Takeaway";
        case "summary":
          return "Add Summary";
        case "comments":
          return "Add Comment";
        case "cited-by":
          break;
        case "limitations":
          return "Add Limitation";
        case "paper-pdf":
          return "Add Paper PDF";
        default:
          break;
      }
    }
  };

  renderSubtitle = () => {
    let { props, isOpen } = this.props.modals.openPaperFeatureModal;

    if (props) {
      switch (props.tab) {
        case "key-takeaways":
          return "Earn 1 RSC for adding a key takeaway to the paper";
        case "summary":
          return "Earn 5 RSC for being the first person to add a summary to this paper";
        case "cited-by":
          break;
        case "limitations":
          return "Earn 1 RSC for adding a limitation to the paper";
        default:
          break;
      }
    }
  };

  formatNewBullet = () => {
    let ordinal = this.props.bulletsRedux.bullets.length + 1;

    if (ordinal > BULLET_COUNT) {
      ordinal = null;
    }

    let newBullet = {
      plain_text: this.state.keyTakeawayText,
      ordinal,
      bullet_type: "KEY_TAKEAWAY",
    };

    return newBullet;
  };

  formatNewLimitation = () => {
    let ordinal = this.props.limitations.limits.length + 1;

    if (ordinal > LIMITATIONS_COUNT) {
      ordinal = null;
    }

    let newBullet = {
      plain_text: this.state.limitationText,
      ordinal,
      bullet_type: "LIMITATION",
    };

    return newBullet;
  };

  submitBulletPoint = async () => {
    let { bulletsRedux, postBullet, showMessage, setMessage } = this.props;
    this.props.showMessage({ load: true, show: true });
    let paperId = this.props.paperId;
    let bullet = this.formatNewBullet();
    this.setState({ pendingSubmission: true });
    await postBullet({
      paperId,
      bullet,
      prevState: bulletsRedux,
      progress: true,
    });
    if (!this.props.bulletsRedux.pending && this.props.bulletsRedux.success) {
      showMessage({ show: false });
      setMessage("Key takeaway successfully added!");
      showMessage({ show: true });
      this.setState({ pendingSubmission: false });
      this.closeModal();
    } else {
      if (this.props.bulletsRedux.status === 429) {
        this.closeModal();
        return showMessage({ show: false });
      }
      showMessage({ show: false });
      setMessage("Something went wrong.");
      showMessage({ show: true, error: true });
      this.setState({ pendingSubmission: false });
    }
  };

  submitLimitation = async () => {
    let { limitations, postLimitation, showMessage, setMessage } = this.props;
    this.props.showMessage({ load: true, show: true });
    let paperId = this.props.paperId;
    let limitation = this.formatNewLimitation();

    this.setState({ pendingSubmission: true });
    await postLimitation({
      paperId,
      limitation,
      prevState: limitations,
      progress: true,
    });
    if (!this.props.limitations.pending && this.props.limitations.success) {
      showMessage({ show: false });
      setMessage("Limitation successfully added!");
      showMessage({ show: true });
      this.setState({
        pendingSubmission: false,
      });
      this.props.modals.openPaperFeatureModal.props.setLimitCount(
        limitations.limits.length
      );
      this.closeModal();
    } else {
      if (this.props.limitations.status === 429) {
        this.closeModal();
        return showMessage({ show: false });
      }
      showMessage({ show: false });
      setMessage("Something went wrong.");
      showMessage({ show: true, error: true });
      this.setState({
        pendingSubmission: false,
      });
    }
  };

  onEditorStateChange = (editorState) => {
    // let { paper } = this.props;
    // this.setState({ summaryEditorState: editorState }, () => {
    //   let editorJSON = JSON.stringify(editorState.toJSON());
    //   if (localStorage) {
    //     localStorage.setItem(
    //       `editorState-${paper.id}-${paper.summary && paper.summary.id}`,
    //       editorJSON
    //     );
    //   }
    // });
  };

  submitSummary = (raw, plain_text) => {
    let {
      setMessage,
      showMessage,
      checkUserFirstTime,
      updatePaperState,
    } = this.props;
    showMessage({ show: true, load: true });
    let summary = raw;
    let summary_plain_text = plain_text;
    let param = {
      summary,
      paper: this.props.paper.id,
      previousSummaryId: this.props.paper.summary
        ? this.props.paper.summary.id
        : null,
      summary_plain_text,
    };

    return fetch(API.SUMMARY({ progress: true }), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showMessage({ show: false });
        let { paper } = this.props;
        let localStorageKey = `editorState-${paper.id}-${paper.summary &&
          paper.summary.id}`;
        if (localStorage.getItem(localStorageKey)) {
          localStorage.removeItem(localStorageKey);
        }
        if (!res.approved) {
          setMessage("Edits Submitted for Approval!");
        } else {
          this.ampEvent("summary");
          let updatedPaper = { ...paper };
          updatedPaper.summary = { ...res };
          updatePaperState && updatePaperState(updatedPaper);
          setMessage("Edits Made!");
          let firstTime = !this.props.auth.user.has_seen_first_coin_modal;
          checkUserFirstTime(firstTime);
        }
        showMessage({ show: true });
        this.closeModal();
      })
      .catch((err) => {
        console.log("err", err);
        if (err.response.status === 429) {
          showMessage({ show: false });
          this.closeModal();
          return this.props.openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  submitComment = async (text, plain_text) => {
    let {
      setMessage,
      showMessage,
      checkUserFirstTime,
      updatePaperState,
      auth,
      paper,
    } = this.props;

    let paperId = paper.id;
    showMessage({ load: true, show: true });

    let param = {
      text,
      paper: paperId,
      plain_text,
    };

    let config = await API.POST_CONFIG(param);

    return fetch(API.DISCUSSION({ paperId, progress: true }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let { props, isOpen } = this.props.modals.openPaperFeatureModal;
        let newDiscussion = { ...resp };
        newDiscussion = thread(newDiscussion);
        props.setDiscussionThreads([newDiscussion, ...props.threads]);
        props.setCount(props.commentCount + 1);
        this.ampEvent("comment");
        setTimeout(() => {
          showMessage({ show: false });
          setMessage("Successfully Saved!");
          showMessage({ show: true });
          checkUserFirstTime(!auth.user.has_seen_first_coin_modal);
          this.closeModal();
        }, 800);
      })
      .catch((err) => {
        if (err.response.status === 429) {
          showMessage({ show: false });
          this.closeModal();
          return this.props.openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  paperPdfCancel = () => {
    this.props.removePaperFromState();
    this.closeModal();
  };

  ampEvent = (type) => {
    let payload;

    if (type === "summary") {
      payload = {
        event_type: "create_summary",
        time: +new Date(),
        user_id: this.props.auth.user
          ? this.props.auth.user.id && this.props.auth.user.id
          : null,
        event_properties: {
          paper: this.props.paper.id,
          interaction: "Paper Summary",
        },
      };
    } else if (type === "comment") {
      // amp events
      payload = {
        event_type: "create_thread",
        time: +new Date(),
        user_id: this.props.auth.user
          ? this.props.auth.user.id && this.props.auth.user.id
          : null,
        event_properties: {
          interaction: "Post Thread",
          paper: this.props.paper.id,
        },
      };
    }

    sendAmpEvent(payload);
  };

  /**
   * Shows a confirmation to the user if there are 1 or more "similar papers" found in search
   */
  confirmSave = () => {
    let { setMessage, showMessage, alert } = this.props;
    let paperInReduxState = this.props.paper.uploadedPaper;
    if (!Object.keys(paperInReduxState).length) {
      setMessage("Add a PDF to upload");
      return showMessage({ show: true, clickOff: true, error: true });
    }

    if (true) {
      return alert.show({
        text: "Are you sure this is the PDF for the paper?",
        buttonText: "Yes",
        onClick: () => {
          this.savePdf();
        },
      });
    } else {
      return this.savePdf();
    }
  };

  /**
   * @param {Array} acceptedFiles - a list containing the file that the user has uploaded
   * @param {Object} paperMetaData - a object decorated with the meta data for the file/paper the user has uploaded
   */
  handleFileDrop = (acceptedFiles, paperMetaData) => {
    let paperFile = acceptedFiles[0];
    this.props.uploadPaperToState(paperFile, paperMetaData);
  };

  /**
   * Makes a call to save the pdf, then removes the paper from redux state
   */
  savePdf = async () => {
    let {
      paper,
      showMessage,
      setMessage,
      checkUserFirstTime,
      clearPostedPaper,
      removePaperFromState,
      patchPaper,
      updatePaperState,
    } = this.props;
    showMessage({ load: true, show: true });
    let paperId = paper.id;
    let paperInReduxState = paper.uploadedPaper;
    let body = {
      file: paperInReduxState.url ? paperInReduxState.url : paperInReduxState,
    };
    await patchPaper(paperId, body, true);
    let paperState = this.props.paper;

    if (paperState.success) {
      showMessage({ show: false });
      setMessage("PDF successfully uploaded!");
      showMessage({ show: true, clickOff: true });
      checkUserFirstTime();
      let postedPaper = paperState.postedPaper;
      let paperFile = postedPaper.file ? postedPaper.file : postedPaper.url;
      // setFile(paperFile);
      if (postedPaper.file) {
        postedPaper.file = paperFile;
        updatePaperState && updatePaperState(postedPaper);
      } else if (postedPaper.url) {
        postedPaper.url = paperFile;
        updatePaperState && updatePaperState(postedPaper);
      }
      clearPostedPaper();
      removePaperFromState();
      this.closeModal();
    } else {
      showMessage({ show: false });
      setMessage("Something went wrong.");
      showMessage({ show: true, clickOff: true, error: true });
    }
  };

  renderBody = () => {
    let { props, isOpen } = this.props.modals.openPaperFeatureModal;
    let { pendingSubmission } = this.state;
    if (props) {
      switch (props.tab) {
        case "key-takeaways":
          return (
            <div className={css(styles.bulletForm, styles.showBulletForm)}>
              <FormTextArea
                id={"keyTakeawayText"}
                containerStyle={inputStyles.formContainer}
                labelStyle={inputStyles.formLabel}
                inputStyle={inputStyles.formInput}
                onChange={this.handleText}
                value={this.state.keyTakeawayText}
              />
              <div className={css(styles.buttonRow)}>
                <Ripples
                  className={css(
                    styles.cancelButton,
                    pendingSubmission && styles.disabled
                  )}
                  onClick={
                    pendingSubmission
                      ? null
                      : () => this.transitionWrapper(this.closeModal)
                  }
                >
                  Cancel
                </Ripples>
                <Button
                  label={
                    pendingSubmission ? (
                      <Loader loading={true} size={20} color={"#fff"} />
                    ) : (
                      "Submit"
                    )
                  }
                  size={"small"}
                  onClick={this.submitBulletPoint}
                  disabled={pendingSubmission}
                  customButtonStyle={styles.customButtonStyle}
                />
              </div>
            </div>
          );
        case "summary":
          return (
            <div className={css(styles.container)} id="summary-tab">
              <div className={css(styles.summaryEdit)}>
                <div className={css(styles.headerContainer)}>
                  <div className={css(styles.guidelines)}>
                    Please review our{" "}
                    <a
                      className={css(styles.authorGuidelines)}
                      href="https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
                      target="_blank"
                    >
                      Summary Guidelines
                    </a>{" "}
                    to see how to write for ResearchHub
                  </div>
                </div>
                <TextEditor
                  canEdit={true}
                  canSubmit={true}
                  commentEditor={false}
                  initialValue={this.state.summaryEditorState}
                  onCancel={this.closeModal}
                  onSubmit={this.submitSummary}
                  onChange={this.onEditorStateChange}
                  smallToolBar={true}
                  // hideButton={true}
                  placeholder={`Description: Distill this paper into a short paragraph.`}
                  commentStyles={styles.commentStyles}
                  removeStickyToolbar={true}
                />
              </div>
            </div>
          );
        case "limitations":
          return (
            <div className={css(styles.bulletForm, styles.showBulletForm)}>
              <FormTextArea
                id={"limitationText"}
                containerStyle={inputStyles.formContainer}
                labelStyle={inputStyles.formLabel}
                inputStyle={inputStyles.formInput}
                onChange={this.handleText}
                value={this.state.limitationText}
              />
              <div className={css(styles.buttonRow)}>
                <Ripples
                  className={css(
                    styles.cancelButton,
                    pendingSubmission && styles.disabled
                  )}
                  onClick={
                    pendingSubmission
                      ? null
                      : () => this.transitionWrapper(this.closeModal)
                  }
                >
                  Cancel
                </Ripples>
                <Button
                  label={
                    pendingSubmission ? (
                      <Loader loading={true} size={20} color={"#fff"} />
                    ) : (
                      "Submit"
                    )
                  }
                  size={"small"}
                  onClick={this.submitLimitation}
                  disabled={pendingSubmission}
                  customButtonStyle={styles.customButtonStyle}
                />
              </div>
            </div>
          );
        case "comments":
          return (
            <div className={css(styles.commentContainer)}>
              <TextEditor
                canEdit={true}
                readOnly={false}
                onChange={this.handleDiscussionTextEditor}
                placeholder={"Leave a question or a comment"}
                initialValue={this.state.commentEditorState}
                commentEditor={true}
                smallToolBar={true}
                onCancel={this.closeModal}
                onSubmit={this.submitComment}
                commentEditorStyles={styles.commentEditorStyles}
              />
            </div>
          );
        case "paper-pdf":
          return (
            <div className={css(styles.dndContainer)}>
              <NewDND
                handleDrop={this.handleFileDrop}
                // onSearch={checkSearchResults}
              />
              <div className={css(styles.buttonRow)}>
                <Ripples
                  className={css(styles.cancelButton)}
                  onClick={this.paperPdfCancel}
                >
                  Cancel
                </Ripples>
                <Button label={"Save PDF"} onClick={this.confirmSave} />
              </div>
            </div>
          );
        case "figures":
          break;
        case "cited-by":
          break;
        default:
          break;
      }
    }
  };

  render() {
    const { props, isOpen } = this.props.modals.openPaperFeatureModal;
    return (
      <BaseModal
        isOpen={isOpen}
        closeModal={this.closeModal}
        title={this.renderTitle()}
        subtitle={this.renderSubtitle()}
      >
        <div className={css(styles.modalContainer)}>{this.renderBody()}</div>
      </BaseModal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: "20px",
    paddingBottom: 0,
    width: 600,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      width: "80%",
    },
  },
  // KEY TAKEAWAYS && LIMITATIONS
  bulletForm: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    transition: "all ease-in-out 0.1s",
    // height: 60,
    paddingBottom: 16,
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 15,
    paddingBottom: 15,
  },
  summaryButtonRow: {},
  cancelButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      color: "#3971FF",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  submitButton: {
    marginLeft: 5,
    cursor: "pointer",
    color: "#fff",
    height: 37,
    width: 126,
    minWidth: 126,
    fontSize: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    backgroundColor: colors.BLUE(),
    ":hover": {
      color: "#3971FF",
    },
  },
  disabled: {
    opacity: "0.4",
  },
  // SUMMARY
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    maxHeight: "60vh",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    borderRadius: 4,
    position: "sticky",
    top: 0,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  summaryEdit: {
    width: "100%",
    // transition: "all ease-in-out 0.2s",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: "10px 0px 15px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid rgb(235, 235, 235)",
  },
  header: {
    fontWeight: 500,
    fontSize: 26,
    color: colors.BLACK(),
    marginBottom: 5,
  },
  guidelines: {
    color: "rgba(36, 31, 58, 0.8)",
    textAlign: "left",
    letterSpacing: 0.2,
    width: "100%",
    fontSize: 13,
  },
  commentStyles: {
    paddingTop: 5,
    backgroundColor: "#fbfbfd",
    borderRadius: 4,
    border: "1px solid #F0F0F0",
    boxSizing: "border-box",
    marginTop: 20,
    lineHeight: 1.6,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  customButtonStyle: {
    // width: 'unset'
  },
  commentContainer: {
    border: "1px solid #E7E7E7",
    width: "100%",
    boxSizing: "border-box",
    marginTop: 20,
  },
  commentEditorStyles: {
    width: "100%",
    boxSizing: "border-box",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  dndContainer: {
    marginTop: 20,
  },
});

const inputStyles = StyleSheet.create({
  formContainer: {
    margin: 0,
    padding: 0,
    width: "100%",
  },
  formLabel: {
    margin: 0,
    padding: 0,
    display: "none",
  },
  formInput: {
    margin: 0,
    minHeight: 50,
  },
});

const mapStateToProps = (state) => ({
  bulletsRedux: state.bullets,
  modals: state.modals,
  limitations: state.limitations,
  paperId: state.paper.id,
  auth: state.auth,
});

const mapDispatchToProps = {
  openPaperFeatureModal: ModalActions.openPaperFeatureModal,
  //KEY TAKEAWAY
  getBullets: BulletActions.getBullets,
  postBullet: BulletActions.postBullet,
  //LIMITS
  getLimitations: LimitationsActions.getLimitations,
  postLimitation: LimitationsActions.postLimitation,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  //SUMMARY
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  //PAPER PDF
  uploadPaperToState: PaperActions.uploadPaperToState,
  clearPostedPaper: PaperActions.clearPostedPaper,
  removePaperFromState: PaperActions.removePaperFromState,
  patchPaper: PaperActions.patchPaper,
  // CAPTCHA
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(PaperFeatureModal));
