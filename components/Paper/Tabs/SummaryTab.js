import Link from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Plain from "slate-plain-serializer";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";
import Ripples from "react-ripples";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";
import { convertToEditorValue } from "~/config/utils";

class SummaryTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: true,
      editorState: null,
      editorValue: null,
      menuOpen: false,
      addSummary: false,
      transition: false,
      firstLoad: true,
      summaryExists: false,
    };
  }

  /**
   * Opens the add summary
   */
  addSummary = () => {
    this.setState({ transition: true }, () => {
      setTimeout(() => {
        this.setState({
          addSummary: true,
          readOnly: false,
          transition: false,
        });
      }, 200);
    });
  };

  onEditorStateChange = (editorState) => {
    let { paper } = this.props;
    this.setState({
      editorState,
    });
    let editorJSON = JSON.stringify(editorState.toJSON());

    if (this.state.firstLoad) {
      this.setState({
        firstLoad: false,
      });
      return;
    }

    localStorage.setItem(
      `editorState-${paper.id}-${paper.summary && paper.summary.id}`,
      editorJSON
    );
  };

  submitEdit = (raw, plain_text) => {
    let { setMessage, showMessage, checkUserFirstTime, getUser } = this.props;
    let value = this.state.editorState;
    let summary = value.toJSON({ preserveKeys: true });
    let summary_plain_text = Plain.serialize(value);

    let param = {
      summary,
      paper: this.props.paperId,
      previousSummaryId: this.props.paper.summary
        ? this.props.paper.summary.id
        : null,
      summary_plain_text,
    };
    return fetch(API.SUMMARY({}), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let { paper } = this.props;
        let localStorageKey = `editorState-${paper.id}-${paper.summary &&
          paper.summary.id}`;
        if (localStorage.getItem(localStorageKey)) {
          localStorage.removeItem(localStorageKey);
        }
        if (!resp.approved) {
          this.initializeSummary();
          setMessage("Edits Submitted for Approval!");
        } else {
          setMessage("Edits Made!");
          let firstTime = !this.props.auth.user.has_seen_first_coin_modal;
          checkUserFirstTime(firstTime);
          getUser();
          this.setState({
            summaryExists: true,
          });
        }
        showMessage({ show: true });
        this.setState({
          readOnly: true,
          finishedLoading: true,
        });
      });
  };

  cancel = () => {
    this.setState({ transition: true }, () => {
      setTimeout(() => {
        this.initializeSummary();
        this.setState({
          readOnly: true,
          addSummary: false,
          transition: false,
        });
      }, 200);
    });
  };

  edit = () => {
    this.setState({
      readOnly: false,
    });

    /********************************************************************************
     * If we go into edit mode, if we have the editor state saved into local storage
     * then try to pull it back and reuse that localstorage state
     *******************************************************************************/
    let { paper } = this.props;
    let editorStateItem = localStorage.getItem(
      `editorState-${paper.id}-${paper.summary && paper.summary.id}`
    );

    if (editorStateItem) {
      let editorState = Value.fromJSON(JSON.parse(editorStateItem));
      this.setState({
        editorState,
      });
    }
  };

  /**
   * Initializes the summary from the paper redux
   */
  initializeSummary = () => {
    const { paper } = this.props;
    if (paper.summary) {
      if (paper.summary.summary) {
        let summaryJSON = paper.summary.summary;
        let editorState = Value.fromJSON(summaryJSON);
        this.setState({
          editorState,
          finishedLoading: true,
        });
      }
    }
  };

  componentDidMount() {
    this.initializeSummary();
  }

  render() {
    let { paper } = this.props;
    let { transition } = this.state;
    return (
      <ComponentWrapper>
        <div>{this.state.errorMessage}</div>
        {(paper.summary && paper.summary.summary) ||
        this.state.summaryExists ? (
          <div className={css(styles.container)}>
            {this.state.readOnly ? (
              <div className={css(styles.summaryActions)}>
                <Link
                  href={"/paper/[paperId]/[tabName]/edits"}
                  as={`/paper/${paper.id}/summary/edits`}
                >
                  <Ripples className={css(styles.action)}>
                    View Edit History
                  </Ripples>
                </Link>
                <PermissionNotificationWrapper
                  modalMessage="propose summary edits"
                  onClick={this.edit}
                  permissionKey="ProposeSummaryEdit"
                  loginRequired={true}
                >
                  <div className={css(styles.action)}>
                    <div className={css(styles.pencilIcon)}>
                      <i className="fas fa-pencil"></i>
                    </div>
                    Edit Summary
                  </div>
                </PermissionNotificationWrapper>
              </div>
            ) : (
              <div className={css(styles.headerContainer)}>
                <div className={css(styles.header)}>Editing Summary</div>
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
            )}
            {this.state.finishedLoading && (
              <TextEditor
                canEdit={true}
                readOnly={this.state.readOnly}
                canSubmit={true}
                commentEditor={false}
                initialValue={this.state.editorState}
                passedValue={this.state.editorState}
                onCancel={this.cancel}
                onSubmit={this.submitEdit}
                onChange={this.onEditorStateChange}
                smallToolBar={true}
                hideButton={true}
              />
            )}
            {!this.state.readOnly && (
              <div className={css(styles.buttonRow)}>
                <Ripples
                  className={css(styles.cancelButton)}
                  onClick={this.cancel}
                >
                  Cancel
                </Ripples>
                <Ripples
                  className={css(styles.submitButton)}
                  onClick={this.submitEdit}
                >
                  Submit
                </Ripples>
              </div>
            )}
          </div>
        ) : (
          <div
            className={css(
              styles.container,
              styles.noSummaryContainer,
              transition && styles.transition
            )}
          >
            {this.state.addSummary ? (
              <div className={css(styles.summaryEdit)}>
                <div className={css(styles.headerContainer)}>
                  <div className={css(styles.header)}>Editing Summary</div>
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
                  onCancel={this.cancel}
                  onSubmit={this.submitEdit}
                  onChange={this.onEditorStateChange}
                  smallToolBar={true}
                  hideButton={true}
                />
                <div className={css(styles.buttonRow)}>
                  <Ripples
                    className={css(styles.cancelButton)}
                    onClick={this.cancel}
                  >
                    Cancel
                  </Ripples>
                  <Ripples
                    className={css(styles.submitButton)}
                    onClick={this.submitEdit}
                  >
                    Submit
                  </Ripples>
                </div>
              </div>
            ) : (
              <div className={css(styles.box) + " second-step"}>
                <div className={css(styles.icon)}>
                  <i className="fad fa-file-alt" />
                </div>
                <h2 className={css(styles.noSummaryTitle)}>
                  A summary hasn't been filled in yet.
                </h2>
                <div className={css(styles.text)}>
                  Earn 5 RHC for being the first person to add a summary to this
                  paper.
                </div>
                <PermissionNotificationWrapper
                  onClick={this.addSummary}
                  modalMessage="propose a summary"
                  permissionKey="ProposeSummaryEdit"
                  loginRequired={true}
                >
                  <button className={css(styles.button)}>Add Summary</button>
                </PermissionNotificationWrapper>
              </div>
            )}
          </div>
        )}
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    boxSizing: "border-box",
    transition: "all ease-in-out 0.3s",
  },
  noSummaryContainer: {
    alignItems: "center",
    opacity: 1,
    transition: "all ease-in-out 0.3s",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: "10px 0px 15px",
    // marginLeft: 30,
    // position: 'sticky',
    // top: 80,
    backgroundColor: "#FFF",
    borderBottom: "1px solid rgb(235, 235, 235)",
    // zIndex: 3
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
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
  text: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    marginBottom: 24,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  summaryActions: {
    width: 250,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 0,
    // marginBottom: 10,
  },
  summaryEdit: {
    marginBottom: 50,
    width: "100%",
    transition: "all ease-in-out 0.3s",
  },
  action: {
    color: "#241F3A",
    fontSize: 14,
    opacity: 0.6,
    display: "flex",
    cursor: "pointer",
    transition: "all ease-out 0.1s",
    padding: "3px 5px",
    ":hover": {
      color: colors.BLUE(1),
      opacity: 1,
      textDecoration: "underline",
    },
  },
  button: {
    border: "1px solid",
    borderColor: colors.PURPLE(1),
    padding: "8px 32px",
    background: "#fff",
    color: colors.PURPLE(1),
    fontSize: 16,
    borderRadius: 4,
    height: 45,
    outline: "none",
    cursor: "pointer",
    ":hover": {
      borderColor: "#FFF",
      color: "#FFF",
      backgroundColor: colors.PURPLE(1),
    },
    "@media only screen and (max-width: 415px)": {
      padding: "6px 24px",
      fontSize: 12,
    },
  },
  pencilIcon: {
    marginRight: 5,
  },
  draftContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  editHistoryContainer: {
    position: "absolute",
    right: -280,
    background: "#F9F9FC",
  },
  selectedEdit: {
    background: "#F0F1F7",
  },
  editHistoryCard: {
    width: 250,
    padding: "5px 10px",
    cursor: "pointer",
  },
  date: {
    fontSize: 14,
    fontWeight: 500,
  },
  user: {
    fontSize: 12,
    opacity: 0.5,
  },
  revisionTitle: {
    padding: 10,
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
  transition: {
    opacity: 0,
  },
  buttonRow: {
    width: "100%",
    position: "sticky",
    paddingTop: 12,
    paddingBottom: 10,
    bottom: 0,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTop: "1px solid rgb(235, 235, 235)",
    zIndex: 3,
  },
  cancelButton: {
    color: colors.BLUE(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: 45,
    padding: "0px 30px",
    borderRadius: 4,
    marginRight: 5,
    ":hover": {
      textDecoration: "underline",
    },
  },
  submitButton: {
    marginLeft: 5,
    cursor: "pointer",
    color: "#fff",
    backgroundColor: colors.BLUE(),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    height: 45,
    borderRadius: 4,
    padding: "0px 30px",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
  auth: state.auth,
});

const mapDispatchToProps = {
  getEditHistory: PaperActions.getEditHistory,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryTab);
