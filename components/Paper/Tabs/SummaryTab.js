import { Fragment } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";
import Link from "next/link";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";
import BulletsContainer from "../BulletsContainer";
import ManageBulletPointsModal from "~/components/Modals/ManageBulletPointsModal";
import FormTextArea from "~/components/Form/FormTextArea";
import SummaryContributor from "../SummaryContributor";
import ModeratorQA from "~/components/Moderator/ModeratorQA";
import SectionBounty from "./SectionBounty";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { isQuillDelta } from "~/config/utils/";

import { sendAmpEvent, checkSummaryVote } from "~/config/fetch";

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

      //
      checked: false,
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
      updateSummary,
    } = this.props;
    let summary = content;
    let summary_plain_text = plain_text;

    let param = {
      summary,
      paper: this.props.paperId,
      previousSummaryId: this.props.summary ? this.props.summary.id : null,
      summary_plain_text,
    };
    return fetch(API.SUMMARY({}), API.POST_CONFIG(param))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        if (!resp.approved) {
          this.initializeSummary();
          setMessage("Edits Submitted for Approval!");
        } else {
          const ampPayload = this.formatAmpPayload(resp.id);
          sendAmpEvent(ampPayload);
          checkUserFirstTime(!this.props.auth.user.has_seen_first_coin_modal);
          getUser();
          const updatedPaper = { ...this.props.paper, summary: resp };
          updatePaperState && updatePaperState(updatedPaper);
          updateSummary && updateSummary(resp);
          this.setState({
            summaryExists: true,
          });
        }
        setMessage("Edits Made!");
        showMessage({ show: true });
        this.setState({
          readOnly: true,
          finishedLoading: true,
        });
      })
      .catch((err) => {
        if (err.response.status === 429) {
          this.props.openRecaptchaPrompt(true);
        }
      });
  };

  formatAmpPayload = (id) => ({
    event_type: "create_summary",
    time: +new Date(),
    user_id: this.props.auth.user
      ? this.props.auth.user.id && this.props.auth.user.id
      : null,
    insert_id: `summary_${id}`,
    event_properties: {
      paper: this.props.paperId,
      interaction: "Paper Summary",
    },
  });

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
        if (res.payload && res.payload.errorBody) {
          if (
            res.payload.errorBody.status &&
            res.payload.errorBody.status === 429
          ) {
            return showMessage({ show: false });
          }
        }
        showMessage({ show: false });
        setMessage("Abstract successfully edited.");
        showMessage({ show: true });
        this.setState({ editAbstract: false });
      })
      .catch((err) => {
        if (err.response.status === 429) {
          showMessage({ show: false });
          return this.props.openRecaptchaPrompt(true);
        }
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
    const { paper, summary } = this.props;

    this.setState({ finishedLoading: false }, () => {
      if (summary) {
        if (summary.summary) {
          if (isQuillDelta(summary.summary)) {
            return this.setState({
              editorState: summary.summary,
              finishedLoading: true,
              abstract: paper.abstract,
              showAbstract: false,
            });
          } else {
            let summaryJSON = summary.summary;
            let editorState = Value.fromJSON(summaryJSON);
            return this.setState({
              editorState: editorState ? editorState : "",
              finishedLoading: true,
              abstract: paper.abstract,
              showAbstract: false,
            });
          }
        }
        if (paper.abstract) {
          this.setState({ abstract: paper.abstract, showAbstract: true });
        }
      } else {
        if (paper.abstract) {
          this.setState({ abstract: paper.abstract, showAbstract: true });
        }
      }
    });
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
    if (prevProps.summary !== this.props.summary) {
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
    const { paper } = this.props;
    const { showAbstract } = this.state;

    return (
      <div className={css(styles.tabRow)}>
        <div
          className={css(
            styles.tab,
            styles.summaryTab,
            !showAbstract && styles.activeTab
          )}
          onClick={() => this.toggleDescription(false)}
        >
          Summary
        </div>
        <div
          className={css(styles.tab, showAbstract && styles.activeTab)}
          onClick={() => this.toggleDescription(true)}
        >
          Abstract
        </div>
      </div>
    );
  };

  renderAbstract = () => {
    const { paper, updatePaperState } = this.props;
    let externalSource = paper.retrieved_from_external_source;
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
                  <div
                    className={css(
                      styles.abstractContainer,
                      !externalSource && styles.whiteSpace
                    )}
                  >
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
    const { paper, summary, loadingSummary, updatePaperState } = this.props;
    const { transition } = this.state;
    return (
      <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
        <a name="takeaways" id={"takeaway"}>
          <div
            className={css(styles.bulletsContainer)}
            ref={this.props.keyTakeawayRef}
            id="takeaways-tab"
          >
            <BulletsContainer
              paperId={this.props.paperId}
              afterFetchBullets={this.props.afterFetchBullets}
              updatePaperState={updatePaperState}
              paper={paper}
            />
          </div>
        </a>
        <div>{this.state.errorMessage}</div>
        {this.state.showAbstract ? (
          this.renderAbstract()
        ) : (
          <a name="summary">
            {(summary && summary.summary) || this.state.summaryExists ? (
              <div
                className={css(styles.container)}
                ref={this.props.descriptionRef}
                id="summary-tab"
              >
                {this.state.readOnly ? (
                  <Fragment>
                    <div className={css(styles.sectionHeader)}>
                      <h3 className={css(styles.sectionTitle)}>
                        <span className={css(styles.titleRow)}>
                          Description
                          <SectionBounty paper={paper} section={"summary"} />
                        </span>
                        {this.renderTabs()}
                      </h3>
                      <div className={css(styles.summaryActions)}>
                        <Link
                          href={"/paper/[paperId]/[paperName]/edits"}
                          as={`/paper/${paper.id}/${paper.slug}/edits`}
                        >
                          <Ripples
                            className={css(styles.action, styles.editHistory)}
                          >
                            <span className={css(styles.pencilIcon)}>
                              {icons.manage}
                            </span>
                            View Revisons
                          </Ripples>
                        </Link>
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
                              {icons.pencil}
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
                  <Fragment>
                    <SummaryContributor
                      summary={summary}
                      loadingSummary={loadingSummary}
                    />
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
                  </Fragment>
                )}
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
                      placeholder={`Description: Distill this paper into a short paragraph. What is the main take away and why does it matter?
                      
  Hypothesis: What question does this paper attempt to answer?

  Conclusion: What conclusion did the paper reach?

  Significance: What does this paper make possible in the world, and what should be tried from here?
                      `}
                      commentStyles={styles.commentStyles}
                      editing={this.state.editing}
                    />
                  </div>
                ) : (
                  <Fragment>
                    <div className={css(styles.sectionHeader)}>
                      <div className={css(styles.sectionTitle)}>
                        <span className={css(styles.titleRow)}>
                          Description
                          <SectionBounty paper={paper} section={"summary"} />
                        </span>
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
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 50,
    position: "relative",
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  moderatorButton: {
    position: "absolute",
    top: 0,
    right: 0,
    "@media only screen and (max-width: 767px)": {
      right: -10,
      top: -10,
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
    position: "relative",
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
    // whiteSpace: "pre-wrap",
    display: "flex",
    justifyContent: "flex-start",
    paddingTop: 7,
  },
  whiteSpace: {
    // whiteSpace: "pre-wrap",
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
    margin: 0,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  titleRow: {
    display: "flex",
  },
  noSummaryContainer: {
    alignItems: "center",
    opacity: 1,
    transition: "all ease-in-out 0.3s",
  },
  metaRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  column: {
    width: 178,
    marginLeft: 8,
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  date: {
    fontSize: 14,
    fontWeight: 400,
    fontWeight: 500,
  },
  selected: {},
  user: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 3,
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
    width: "max-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 0,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "flex-start",
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
    },
  },
  abstractActions: {
    display: "flex",
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
    },
  },
  pinAction: {
    marginRight: 15,
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
  editHistory: {
    marginRight: 15,
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
      backgroundColor: "#3971FF",
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
    "@media only screen and (max-width: 767px)": {
      marginRight: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  summaryTab: {},
  activeTab: {
    backgroundColor: colors.BLUE(0.11),
    color: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
  getEditHistory: PaperActions.getEditHistory,
  patchPaper: PaperActions.patchPaper,
  // updateRedux: PaperActions.updatePaperState,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryTab);
