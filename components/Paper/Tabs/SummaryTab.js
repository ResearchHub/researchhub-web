import Link from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";

class SummaryTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: true,
      editorState: null,
      menuOpen: false,
      addSummary: false,
      transition: false,
      firstLoad: true,
    };
  }

  /**
   * Opens the add summary
   */
  addSummary = async () => {
    await this.setState({ transition: true });
    setTimeout(() => {
      this.setState({
        addSummary: true,
        readOnly: false,
        transition: false,
      });
    }, 200);
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
      `editorState-${paper.id}-${paper.summary.id}`,
      editorJSON
    );
  };

  submitEdit = (raw) => {
    let { setMessage, showMessage } = this.props;
    let param = {
      summary: raw,
      paper: this.props.paperId,
      previousSummaryId: this.props.paper.summary
        ? this.props.paper.summary.id
        : null,
    };
    return fetch(API.SUMMARY({}), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        localStorage.remove(`editorState-${paper.id}-${paper.summary.id}`);
        if (!resp.approved) {
          this.initializeSummary();
          setMessage("Edits Submitted for Approval!");
        } else {
          setMessage("Edits Made!");
        }
        showMessage({ show: true });
        this.setState({
          readOnly: true,
        });
      })
      .catch((err) => {
        // TODO: Use a proper notification message instead
        this.setState({
          errorMessage: "Not enough reputation",
        });
      });
  };

  cancel = async () => {
    await this.setState({ transition: true });
    setTimeout(() => {
      this.initializeSummary();
      this.setState({
        readOnly: true,
        addSummary: false,
        transition: false,
      });
    }, 200);
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
      `editorState-${paper.id}-${paper.summary.id}`
    );

    if (editorStateItem) {
      let editorState = Value.fromJSON(JSON.parse(editorStateItem));
      this.setState({
        editorState,
      });

      // if (this.editor.current) {
      //   this.editor.current.setEditorState(editorState);
      // }
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

        // if (this.editor.current) {
        //   this.editor.current.setEditorState(editorState);
        // }
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
        {paper.summary.summary ? (
          <div className={css(styles.container)}>
            {this.state.readOnly ? (
              <div className={css(styles.summaryActions)}>
                <Link
                  href={"/paper/[paperId]/[tabName]/edits"}
                  as={`/paper/${paper.id}/summary/edits`}
                >
                  <div className={css(styles.action)}>View Edit History</div>
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
              />
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
                <TextEditor
                  canEdit={true}
                  canSubmit={true}
                  commentEditor={false}
                  onCancel={this.cancel}
                  onSubmit={this.submitEdit}
                  onChange={this.onEditorStateChange}
                />
              </div>
            ) : (
              <div className={css(styles.box)}>
                <div className={css(styles.icon)}>
                  <i className="fad fa-file-alt" />
                </div>
                <h2 className={css(styles.noSummaryTitle)}>
                  A summary hasn't been filled in yet.
                </h2>
                <div className={css(styles.text)}>
                  Please add a summary to this paper
                </div>
                <PermissionNotificationWrapper
                  onClick={this.addSummary}
                  modalMessage="propose a summary"
                  permissionKey="ProposeSummaryEdit"
                  loginRequired={true}
                >
                  {/* <Ripples> */}
                  <button className={css(styles.button)}>Add Summary</button>
                  {/* </Ripples> */}
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
  },
  noSummaryContainer: {
    alignItems: "center",
    opacity: 1,
    transition: "all ease-in-out 0.3s",
  },
  guidelines: {
    color: "rgba(36, 31, 58, 0.8)",
    textAlign: "center",
    letterSpacing: 0.7,
    marginBottom: 16,
    width: "100%",
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
    width: 280,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryEdit: {
    marginBottom: 50,
    width: "100%",
  },
  action: {
    color: "#241F3A",
    fontSize: 16,
    opacity: 0.6,
    display: "flex",
    cursor: "pointer",
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
});

const mapStateToProps = (state) => ({
  paper: state.paper,
});

const mapDispatchToProps = {
  getEditHistory: PaperActions.getEditHistory,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryTab);
