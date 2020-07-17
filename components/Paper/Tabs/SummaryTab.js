import { Fragment } from "react";
import Router from "next/link";
import Link from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Plain from "slate-plain-serializer";
import Ripples from "react-ripples";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";
import BulletsContainer from "../BulletsContainer";
import ManageBulletPointsModal from "~/components/modal/ManageBulletPointsModal";
import FormTextArea from "~/components/Form/FormTextArea";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import API from "../../../config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../../config/themes/colors";
import { isQuillDelta } from "~/config/utils/";

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
      editing: false,
      // abstract
      abstract: "",
      showAbstract: false,
      editAbstract: false,
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
          editing: true,
        });
      }, 200);
    });
  };

  // TODO: come back to this
  onEditorStateChange = (editorState) => {
    // let { paper } = this.props;
    // this.setState({
    //   editorState,
    // });
    // let editorJSON = JSON.stringify(editorState.toJSON());
    // if (this.state.firstLoad) {
    //   this.setState({
    //     firstLoad: false,
    //   });
    //   return;
    // }
    // if (localStorage) {
    //   localStorage.setItem(
    //     `editorState-${paper.id}-${paper.summary && paper.summary.id}`,
    //     editorJSON
    //   );
    // }
  };

  submitEdit = (content, plain_text) => {
    let {
      setMessage,
      showMessage,
      checkUserFirstTime,
      getUser,
      updatePaperState,
    } = this.props;
    let summary = content;
    let summary_plain_text = plain_text;

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
          updatePaperState("summary", resp);
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
          editing: false,
        });
      }, 200);
    });
  };

  edit = () => {
    this.setState({
      readOnly: false,
      editAbstract: false,
      editing: true,
    });

    /********************************************************************************
     * If we go into edit mode, if we have the editor state saved into local storage
     * then try to pull it back and reuse that localstorage state
     *******************************************************************************/
    // let { paper } = this.props;
    // let editorStateItem = localStorage.getItem(
    //   `editorState-${paper.id}-${paper.summary && paper.summary.id}`
    // );

    // if (editorStateItem) {
    //   let editorState = Value.fromJSON(JSON.parse(editorStateItem));
    //   this.setState({
    //     editorState,
    //   });
    // }
  };

  editAbstract = () => {
    this.setState({ editAbstract: !this.state.editAbstract });
  };

  handleAbstract = (id, value) => {
    this.setState({ abstract: value });
  };

  submitAbstract = () => {
    const { paper, setMessage, showMessage } = this.props;
    showMessage({ show: true, load: true });
    let body = {
      abstract: this.state.abstract,
    };

    this.props
      .patchPaper(paper.id, body)
      .then((res) => {
        showMessage({ show: false });
        setMessage("Abstract successfully edited.");
        showMessage({ show: true });
        this.setState({ editAbstract: false });
      })
      .catch((err) => {
        showMessage({ show: false });
        setMessage("Something went wrong.");
        showMessage({ show: true, error: true });
      });
  };

  showDesktopMsg = () => {
    this.props.setMessage("Edit the summary on Desktop");
    return this.props.showMessage({ show: true });
  };

  /**
   * Initializes the summary from the paper redux
   */
  initializeSummary = () => {
    const { paper } = this.props;
    if (paper.summary) {
      if (paper.summary.summary) {
        if (isQuillDelta(paper.summary.summary)) {
          return this.setState({
            editorState: paper.summary.summary,
            finishedLoading: true,
          });
        }
        let summaryJSON = paper.summary.summary;
        let editorState = Value.fromJSON(summaryJSON);
        this.setState({
          editorState: editorState ? editorState : "",
          finishedLoading: true,
        });
      }
      if (paper.abstract) {
        this.setState({ abstract: paper.abstract, showAbstract: false });
      }
    } else {
      if (paper.abstract) {
        this.setState({ abstract: paper.abstract, showAbstract: true });
      }
    }
  };

  navigateToEditPaperInfo = () => {
    let paperId = this.props.paper.id;
    let href = "/paper/upload/info/[paperId]";
    let as = `/paper/upload/info/${paperId}`;
    Router.push(href, as);
  };

  componentDidMount() {
    this.initializeSummary();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paperId !== this.props.paperId) {
      return this.initializeSummary();
    }
    if (prevProps.paper.summary !== this.props.paper.summary) {
      return this.initializeSummary();
    }
    if (prevProps.paper.abstract !== this.props.paper.abstract) {
      return this.initializeSummary();
    }
  }

  toggleDescription = (state) => {
    this.setState({ showAbstract: state });
  };

  renderTabs = () => {
    return (
      <div className={css(styles.tabRow)}>
        <div
          className={css(
            styles.tab,
            !this.state.showAbstract && styles.activeTab
          )}
          onClick={() => this.toggleDescription(false)}
        >
          Summary
        </div>
        <div
          className={css(
            styles.tab,
            this.state.showAbstract && styles.activeTab
          )}
          onClick={() => this.toggleDescription(true)}
        >
          Abstract
        </div>
      </div>
    );
  };

  renderAbstract = () => {
    let { paper } = this.props;
    if (this.state.showAbstract) {
      if (this.state.editAbstract) {
        return (
          <a name="summary">
            <div
              className={css(styles.container)}
              ref={this.props.descriptionRef}
              id="summary-tab"
            >
              <div className={css(styles.sectionHeader)}>
                <div className={css(styles.sectionTitle)}>
                  Description
                  {this.renderTabs()}
                </div>
              </div>
              <div className={css(styles.abstractTextEditor)}>
                <FormTextArea
                  value={this.state.abstract}
                  onChange={this.handleAbstract}
                  containerStyle={styles.formContainerStyle}
                />
                <div className={css(styles.buttonRow)}>
                  <Ripples
                    className={css(styles.cancelButton)}
                    onClick={this.editAbstract}
                  >
                    Cancel
                  </Ripples>
                  <Ripples
                    className={css(styles.submitButton)}
                    onClick={this.submitAbstract}
                  >
                    Submit
                  </Ripples>
                </div>
              </div>
            </div>
          </a>
        );
      }
      if (paper.abstract || this.state.abstract) {
        return (
          <a name="summary">
            <div
              className={css(styles.container)}
              ref={this.props.descriptionRef}
              id="summary-tab"
            >
              <div className={css(styles.sectionHeader)}>
                <div className={css(styles.sectionTitle)}>
                  Description
                  {this.renderTabs()}
                </div>
                <div className={css(styles.abstractActions)}>
                  <PermissionNotificationWrapper
                    modalMessage="propose abstract edit"
                    onClick={this.editAbstract}
                    loginRequired={true}
                  >
                    <div className={css(styles.action, styles.editAction)}>
                      <div className={css(styles.pencilIcon)}>
                        <i className="fas fa-pencil"></i>
                      </div>
                      {"Edit Abstract"}
                    </div>
                  </PermissionNotificationWrapper>
                </div>
              </div>
              {this.state.readOnly && !this.state.editAbstract && (
                <Fragment>
                  <div className={css(styles.abstractContainer)}>
                    {this.state.abstract}
                  </div>
                </Fragment>
              )}
            </div>
          </a>
        );
      } else {
        return (
          <a name="summary">
            <div
              className={css(styles.container)}
              ref={this.props.descriptionRef}
              id="summary-tab"
            >
              <div className={css(styles.sectionHeader)}>
                <div className={css(styles.sectionTitle)}>
                  Description
                  {this.renderTabs()}
                </div>
              </div>
              <div className={css(styles.centerColumn)}>
                <div className={css(styles.box) + " second-step"}>
                  <div className={css(styles.icon)}>
                    <i className="fad fa-file-alt" />
                  </div>
                  <h2 className={css(styles.noSummaryTitle)}>
                    An abstract hasn't been filled in yet
                  </h2>
                  <div className={css(styles.text)}>
                    Be the first person to add an abstract to this paper.
                  </div>
                  <PermissionNotificationWrapper
                    onClick={this.editAbstract}
                    modalMessage="propose a summary"
                    permissionKey="ProposeSummaryEdit"
                    loginRequired={true}
                  >
                    <button className={css(styles.button)}>Add Abstract</button>
                  </PermissionNotificationWrapper>
                </div>
              </div>
            </div>
          </a>
        );
      }
    }
  };

  render() {
    let { paper } = this.props;
    let { transition } = this.state;

    return (
      <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
        <a name="takeaways" id={"takeaway"}>
          <div
            className={css(styles.bulletsContainer)}
            ref={this.props.keyTakeawayRef}
            id="takeaways-tab"
          >
            <BulletsContainer paperId={this.props.paperId} />
          </div>
        </a>
        <div>{this.state.errorMessage}</div>
        {!this.state.showAbstract && (paper.abstract || paper.summary) ? (
          <a name="summary">
            {(paper.summary && paper.summary.summary) ||
            this.state.summaryExists ? (
              <div
                className={css(styles.container)}
                ref={this.props.descriptionRef}
                id="summary-tab"
              >
                {this.state.readOnly ? (
                  <Fragment>
                    <div className={css(styles.sectionHeader)}>
                      <div className={css(styles.sectionTitle)}>
                        Description
                        {this.renderTabs()}
                      </div>
                      <div className={css(styles.summaryActions)}>
                        {/* <Link
                          href={"/paper/[paperId]/[tabName]/edits"}
                          as={`/paper/${paper.id}/summary/edits`}
                        >
                          <Ripples className={css(styles.action)}>
                            View Edit History
                          </Ripples>
                        </Link> */}
                        <PermissionNotificationWrapper
                          modalMessage="propose summary edits"
                          onClick={this.edit}
                          permissionKey="ProposeSummaryEdit"
                          loginRequired={true}
                        >
                          <div
                            className={css(styles.action, styles.editAction)}
                          >
                            <div className={css(styles.pencilIcon)}>
                              <i className="fas fa-pencil"></i>
                            </div>
                            Edit Summary
                          </div>
                        </PermissionNotificationWrapper>
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <div className={css(styles.headerContainer)} id="summary-tab">
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
                    placeholder={`Description: Distill this paper into a short paragraph. What is the main take away and why does it matter?
                    
                    Hypothesis: What question does this paper attempt to answer?

                    Conclusion: What conclusion did the paper reach?

                    Significance: What does this paper make possible in the world, and what should be tried from here?
                    `}
                    onCancel={this.cancel}
                    onSubmit={this.submitEdit}
                    onChange={this.onEditorStateChange}
                    // smallToolBar={true}
                    // hideButton={true}
                    commentStyles={
                      this.state.readOnly
                        ? styles.commentReadStyles
                        : styles.commentStyles
                    }
                    editing={this.state.editing}
                  />
                )}
                {/* {!this.state.readOnly && (
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
                )} */}
              </div>
            ) : (
              <div
                className={css(
                  styles.container,
                  styles.noSummaryContainer,
                  transition && styles.transition
                )}
                id="summary-tab"
                ref={!this.state.summaryExists && this.props.descriptionRef}
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
                      // smallToolBar={true}
                      // hideButton={true}
                      placeholder={`Description: Distill this paper into a short paragraph. What is the main take away and why does it matter?
                      
Hypothesis: What question does this paper attempt to answer?
  
Conclusion: What conclusion did the paper reach?
  
Significance: What does this paper make possible in the world, and what should be tried from here?
                      `}
                      commentStyles={styles.commentStyles}
                      editing={this.state.editing}
                    />
                    {/* <div className={css(styles.buttonRow)}>
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
                    </div> */}
                  </div>
                ) : (
                  <Fragment>
                    <div className={css(styles.sectionHeader)}>
                      <div className={css(styles.sectionTitle)}>
                        Description
                        {this.renderTabs()}
                      </div>
                    </div>
                    <div className={css(styles.box) + " second-step"}>
                      <div className={css(styles.icon)}>
                        <i className="fad fa-file-alt" />
                      </div>
                      <h2 className={css(styles.noSummaryTitle)}>
                        A summary hasn't been filled in yet
                      </h2>
                      <div className={css(styles.text)}>
                        Earn 5 RSC for being the first person to add a summary
                        to this paper.
                      </div>
                      <PermissionNotificationWrapper
                        onClick={this.addSummary}
                        modalMessage="propose a summary"
                        permissionKey="ProposeSummaryEdit"
                        loginRequired={true}
                      >
                        <button className={css(styles.button)}>
                          Add Summary
                        </button>
                      </PermissionNotificationWrapper>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
          </a>
        ) : (
          this.renderAbstract()
        )}
        <ManageBulletPointsModal paperId={this.props.paperId} />
      </ComponentWrapper>
    );
  }
}

var styles = StyleSheet.create({
  componentWrapperStyles: {
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
    alignItems: "flex-end",
    transition: "all ease-in-out 0.3s",
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  centerColumn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bulletsContainer: {
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,

    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  limitsContainer: {
    marginTop: 30,
  },
  abstractContainer: {
    width: "100%",
    lineHeight: 2,
    whiteSpace: "pre-wrap",
    display: "flex",
    justifyContent: "flex-start",
    minHeight: 173,
    paddingTop: 7,
  },
  abstractText: {
    lineHeight: 1.6,
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  abstractTextEditor: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingTop: 5,
  },
  formContainerStyle: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  sectionHeader: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      paddingBottom: 20,
    },
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 500,
    color: colors.BLACK(),
    display: "flex",
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
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
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      width: 300,
    },
  },
  summaryActions: {
    width: 250,
    display: "flex",
    alignItems: "center",
    // justifyContent: "space-between",
    justifyContent: "flex-end",
    paddingBottom: 0,
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
    },
  },
  abstractActions: {
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
    },
  },
  summaryEdit: {
    width: "100%",
    transition: "all ease-in-out 0.2s",
  },
  action: {
    color: "#241F3A",
    fontSize: 14,
    opacity: 0.6,
    display: "flex",
    cursor: "pointer",
    transition: "all ease-out 0.1s",
    padding: "3px 5px",
    paddingRight: 0,
    "@media only screen and (max-width: 767px)": {
      padding: 0,
    },
    ":hover": {
      color: colors.BLUE(1),
      opacity: 1,
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  editAction: {
    "@media only screen and (max-width: 415px)": {
      marginLeft: 32,
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
    paddingTop: 20,
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
    height: 37,
    width: 126,
    minWidth: 126,
    fontSize: 15,
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
  commentReadStyles: {
    padding: 0,
    paddingTop: 5,
    boxSizing: "border-box",
    lineHeight: 1.6,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  description: {
    fontStyle: "italic",
    fontSize: 12,
  },
  tabLabel: {
    color: colors.BLUE(),
    fontSize: 14,
    padding: "5px 8px",
    cursor: "pointer",
    backgroundColor: "#edeefe",
  },
  tabRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  tab: {
    padding: "4px 12px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginRight: 8,
    color: "rgba(36, 31, 58, 0.6)",
    borderRadius: 4,
    ":hover": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  activeTab: {
    backgroundColor: colors.BLUE(0.11),
    color: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
  auth: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
  getEditHistory: PaperActions.getEditHistory,
  patchPaper: PaperActions.patchPaper,
  updatePaperState: PaperActions.updatePaperState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryTab);
