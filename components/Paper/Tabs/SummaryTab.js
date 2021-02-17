import { Fragment } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";
import ManageBulletPointsModal from "~/components/Modals/ManageBulletPointsModal";
import FormTextArea from "~/components/Form/FormTextArea";
import SummaryContributor from "../SummaryContributor";
import ModeratorQA from "~/components/Moderator/ModeratorQA";
import SectionBounty from "./SectionBounty";
import AbstractPlaceholder from "../../Placeholders/AbstractPlaceholder";

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
import { isQuillDelta, doesNotExist } from "~/config/utils/";
import { sendAmpEvent, checkSummaryVote } from "~/config/fetch";
import { SUMMARY_PLACEHOLDER } from "~/config/constants";

class SummaryTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readOnly: true,
      editorState: null,
      editorValue: null,
      menuOpen: false,
      transition: false,
      firstLoad: true,
      summaryExists: false,
      editing: false,
      finishedLoading: false,
      // abstract
      abstract: "",
      showAbstract: true,
      editAbstract: false,
      checked: false,
    };
  }

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
    const {
      setMessage,
      showMessage,
      checkUserFirstTime,
      getUser,
      updatePaperState,
      updateSummary,
    } = this.props;
    showMessage({ show: true, load: true });
    const summary = content;
    const summary_plain_text = plain_text;

    const param = {
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
          const updatedPaper = {
            ...this.props.paper,
            summary: resp,
          };
          updatePaperState && updatePaperState(updatedPaper);
          updateSummary && updateSummary(resp);
        }
        setMessage("Summary successfully updated!");
        showMessage({ show: true });
        setTimeout(() => showMessage({ show: false }), 2000); // message sometimes persists longer
        this.setState({
          readOnly: true,
          finishedLoading: true,
          editing: false,
          summaryExits: true,
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
    this.initializeSummary();
    this.setState({
      readOnly: true,
      editing: false,
    });
  };

  editSummary = () => {
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
    const { editAbstract, abstract } = this.state;

    this.setState({
      editAbstract: !editAbstract, // don't keep changes when user cancels
    });
  };

  cancelEditAbstract = () => {
    const { paper } = this.props;
    const { editAbstract } = this.state;

    this.setState({
      editAbstract: !editAbstract,
      abstract: paper.abstract,
    });
  };

  handleAbstract = (id, value) => {
    this.setState({ abstract: value });
  };

  submitAbstract = () => {
    const { paper, setMessage, showMessage, updatePaperState } = this.props;
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
        const updatedPaper = {
          ...this.props.paper,
          abstract: this.state.abstract,
        };
        updatePaperState && updatePaperState(updatedPaper);
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
      if (summary && summary.summary) {
        if (isQuillDelta(summary.summary)) {
          // if Quill
          return this.setState({
            editorState: summary.summary,
            finishedLoading: true,
            abstract: paper.abstract,
            // showAbstract: false,
            summaryExists: true,
          });
        } else {
          // if legacy html or slate delta
          const editorState = Value.fromJSON(summary.summary);
          return this.setState({
            editorState: editorState ? editorState : "",
            finishedLoading: true,
            abstract: paper.abstract,
            // showAbstract: false,
            summaryExists: true,
          });
        }
      }

      if (paper.abstract) {
        // if no summary but abstract
        return this.setState({
          abstract: paper.abstract,
          showAbstract: true,
          finishedLoading: true,
        });
      }

      return this.setState({ finishedLoading: true }); // default case
    });
  };

  navigateToEditPaperInfo = () => {
    const paperId = this.props.paper.id;
    const href = "/paper/upload/info/[paperId]";
    const as = `/paper/upload/info/${paperId}`;
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
    const { showAbstract } = this.state;

    return (
      <div className={css(styles.tabRow)}>
        <div
          className={css(styles.tab, !showAbstract && styles.activeTab)}
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

  renderActions = () => {
    const { paper, updatePaperState } = this.props;
    const { summaryExists, showAbstract } = this.state;

    const moderatorBounty = (
      <ModeratorQA
        containerStyles={[styles.action, styles.pinAction]}
        updatePaperState={updatePaperState}
        type={"summary"}
        paper={paper}
      />
    );

    const viewRevisions = (
      <Link
        href={"/paper/[paperId]/[paperName]/edits"}
        as={`/paper/${paper.id}/${paper.slug}/edits`}
      >
        <div className={css(styles.action, styles.editHistory)}>
          <span className={css(styles.pencilIcon)}>{icons.manage}</span>
          View Revisons
        </div>
      </Link>
    );

    const editSummary = (
      <PermissionNotificationWrapper
        modalMessage="propose summary edits"
        onClick={this.editSummary}
        permissionKey="ProposeSummaryEdit"
        loginRequired={true}
      >
        <div className={css(styles.action, styles.editAction)}>
          <div className={css(styles.pencilIcon)}>{icons.pencil}</div>
          Edit Summary
        </div>
      </PermissionNotificationWrapper>
    );

    const editAbstract = (
      <PermissionNotificationWrapper
        modalMessage="propose abstract edit"
        onClick={this.editAbstract}
        loginRequired={true}
      >
        <div className={css(styles.action, styles.editAction)}>
          <div className={css(styles.pencilIcon)}>{icons.pencil}</div>
          {"Edit Abstract"}
        </div>
      </PermissionNotificationWrapper>
    );

    const actions = [];

    if (showAbstract) {
      actions.push(editAbstract);
    } else {
      actions.push(moderatorBounty);
      if (summaryExists) {
        actions.push(viewRevisions, editSummary);
      }
    }

    return <div className={css(styles.summaryActions)}>{actions}</div>;
  };

  renderAbstract = () => {
    const { paper } = this.props;
    const { abstract, showAbstract, editAbstract, readOnly } = this.state;
    const externalSource = paper.retrieved_from_external_source;

    if (showAbstract) {
      if (editAbstract) {
        return (
          <div className={css(styles.abstractTextEditor)}>
            <FormTextArea
              value={abstract}
              onChange={this.handleAbstract}
              containerStyle={styles.formContainerStyle}
            />
            <div className={css(styles.buttonRow)}>
              <Ripples
                className={css(styles.cancelButton)}
                onClick={this.cancelEditAbstract}
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
        );
      }
      if (paper.abstract || abstract) {
        return (
          <Fragment>
            {readOnly && !editAbstract && (
              <div
                className={css(
                  styles.abstractContainer,
                  !externalSource && styles.whiteSpace
                )}
              >
                {abstract}
              </div>
            )}
          </Fragment>
        );
      } else {
        return (
          <div className={css(styles.centerColumn)}>
            <div className={css(styles.box, styles.emptyStateSummary)}>
              <div className={css(styles.icon)}>{icons.file}</div>
              <h2 className={css(styles.noSummaryTitle)}>
                Add an abstract to this paper
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
        );
      }
    } else {
      return <div />;
    }
  };

  renderSummaryEmptyState = () => {
    const { paper, updatePaperState, userVoteChecked } = this.props;
    const { editing } = this.state;

    if (editing) {
      return (
        <div className={css(styles.summaryEdit)}>
          <div className={css(styles.headerContainer)}>
            <div className={css(styles.header)}>Adding Summary</div>
            <div className={css(styles.guidelines)}>
              Please review our{" "}
              <a
                className={css(styles.authorGuidelines)}
                href="https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
                target="_blank"
                rel="noreferrer noopener"
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
            placeholder={SUMMARY_PLACEHOLDER}
            commentStyles={styles.commentStyles}
            editing={editing}
          />
        </div>
      );
    } else {
      return (
        <PermissionNotificationWrapper
          onClick={this.editSummary}
          modalMessage="propose a summary"
          permissionKey="ProposeSummaryEdit"
          loginRequired={true}
          hideRipples={true}
        >
          <div className={css(styles.box, styles.emptyStateSummary)}>
            <div className={css(styles.icon)}>{icons.file}</div>
            <h2 className={css(styles.noSummaryTitle)}>
              Add a summary to this paper
            </h2>
            <p className={css(styles.text)}>
              Earn 5 RSC for being the first to add a summary.
            </p>
            <PermissionNotificationWrapper
              onClick={this.editSummary}
              modalMessage="propose a summary"
              permissionKey="ProposeSummaryEdit"
              loginRequired={true}
            >
              <button className={css(styles.button)}>Add Summary</button>
            </PermissionNotificationWrapper>
          </div>
        </PermissionNotificationWrapper>
      );
    }
  };

  renderSummaryEdit = () => {
    const { editing, readOnly, editorState } = this.state;

    return (
      <div className={css(styles.summaryEdit)}>
        <div className={css(styles.headerContainer)}>
          <div className={css(styles.header)}>Editing Summary</div>
          <div className={css(styles.guidelines)}>
            Please review our{" "}
            <a
              className={css(styles.authorGuidelines)}
              href="https://www.notion.so/ResearchHub-Summary-Guidelines-7ebde718a6754bc894a2aa0c61721ae2"
              target="_blank"
              rel="noreferrer noopener"
            >
              Summary Guidelines
            </a>{" "}
            to see how to write for ResearchHub
          </div>
        </div>
        <TextEditor
          canEdit={true}
          readOnly={readOnly}
          canSubmit={true}
          commentEditor={false}
          initialValue={editorState}
          passedValue={editorState}
          placeholder={SUMMARY_PLACEHOLDER}
          onCancel={this.cancel}
          onSubmit={this.submitEdit}
          onChange={this.onEditorStateChange}
          commentStyles={
            readOnly ? styles.commentReadStyles : styles.commentStyles
          }
          editing={editing}
        />
      </div>
    );
  };

  renderSummaryReadOnly = () => {
    const { summary, loadingSummary } = this.props;
    const { editing, readOnly, editorState } = this.state;

    return (
      <Fragment>
        <SummaryContributor summary={summary} loadingSummary={loadingSummary} />
        <TextEditor
          canEdit={true}
          readOnly={readOnly}
          canSubmit={true}
          commentEditor={false}
          initialValue={editorState}
          passedValue={editorState}
          placeholder={SUMMARY_PLACEHOLDER}
          onCancel={this.cancel}
          onSubmit={this.submitEdit}
          onChange={this.onEditorStateChange}
          commentStyles={
            readOnly ? styles.commentReadStyles : styles.commentStyles
          }
          editing={editing}
        />
      </Fragment>
    );
  };

  renderSummary = () => {
    const { summary, loadingSummary } = this.props;
    const { summaryExists, readOnly, editing, finishedLoading } = this.state;

    if (!doesNotExist(summary.summary) || summaryExists) {
      if (!readOnly || editing) {
        return this.renderSummaryEdit();
      }

      if (finishedLoading) {
        return this.renderSummaryReadOnly();
      }
    }

    return this.renderSummaryEmptyState();
  };

  containerStyle = () => {
    const { summary } = this.props;
    const { summaryExists } = this.state;

    const classNames = [styles.container];

    if (doesNotExist(summary.summary) || !summaryExists) {
      classNames.push(styles.noSummaryContainer);
    }

    return classNames;
  };

  sectionHeaderStyle = () => {
    const { editing } = this.state;

    const classNames = [styles.sectionHeader];

    if (editing) {
      classNames.push(styles.hidden);
    }

    return classNames;
  };

  renderContent = () => {
    const { showAbstract, finishedLoading } = this.state;
    const { paper } = this.props;

    return (
      <div style={{ width: "100%" }}>
        <ReactPlaceholder
          ready={paper && paper.id}
          showLoadingAnimation
          customPlaceholder={<AbstractPlaceholder color="#efefef" />}
        >
          {this.renderAbstract()}
        </ReactPlaceholder>
      </div>
    );
  };

  render() {
    const { paper, updatePaperState, userVoteChecked } = this.props;
    const { showAbstract } = this.state;

    return (
      <a name="summary">
        <div
          className={css(this.containerStyle())}
          ref={this.props.descriptionRef}
          id="summary-tab"
        >
          <div className={css(this.sectionHeaderStyle())}>
            <h3 className={css(styles.sectionTitle)}>
              <span className={css(styles.titleRow)}>
                Abstract
                {!showAbstract && (
                  <SectionBounty
                    paper={paper}
                    section={"summary"}
                    loading={!userVoteChecked}
                    updatePaperState={updatePaperState}
                  />
                )}
              </span>
              {/* {this.renderTabs()} */}
            </h3>
            {this.renderActions()}
          </div>
          {this.renderContent()}
        </div>
        <ManageBulletPointsModal paperId={this.props.paper.id} />
      </a>
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
    marginTop: 40,
    position: "relative",
    boxSizing: "border-box",
    borderRadius: 4,
    "@media only screen and (max-width: 967px)": {
      padding: 25,
    },
  },
  hidden: {
    display: "none",
  },
  centerColumn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  abstractContainer: {
    width: "100%",
    lineHeight: 2,
    display: "flex",
    justifyContent: "flex-start",
    paddingTop: 7,
  },
  abstractText: {
    lineHeight: 1.6,
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
    "@media only screen and (max-width: 967px)": {
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
    "@media only screen and (max-width: 967px)": {
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
    "@media only screen and (max-width: 967px)": {
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,
    },
    "@media only screen and (max-width: 500px)": {
      flexDirection: "column",
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
    transition: "all ease-in-out 0.1s",
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
    "@media only screen and (max-width: 967px)": {
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
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    color: colors.BLACK(0.8),
    margin: "0 0 20px",
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
    "@media only screen and (max-width: 967px)": {
      justifyContent: "flex-start",
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
    },
  },
  abstractActions: {
    display: "flex",
    "@media only screen and (max-width: 967px)": {
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
    "@media only screen and (max-width: 967px)": {
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
  editAction: {},
  editHistory: {
    marginRight: 15,
  },
  button: {
    border: "1px solid",
    padding: "8px 32px",
    color: "#fff",
    background: colors.PURPLE(1),
    fontSize: 16,
    borderRadius: 4,
    height: 45,
    outline: "none",
    cursor: "pointer",
    borderRadius: 5,
    ":hover": {
      backgroundColor: "#3E43E8",
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
    "@media only screen and (max-width: 967px)": {
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
    "@media only screen and (max-width: 967px)": {
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
    "@media only screen and (max-width: 500px)": {
      marginLeft: 0,
      marginTop: 15,
    },
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
    "@media only screen and (max-width: 967px)": {
      marginRight: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  activeTab: {
    backgroundColor: colors.BLUE(0.11),
    color: colors.BLUE(),
  },
  earnRSCButton: {
    fontSize: 14,
    fontWeight: 500,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: colors.ORANGE(0.1),
    color: colors.ORANGE(),
    padding: "4px 12px",
    cursor: "pointer",
    ":hover": {
      boxShadow: `0px 0px 2px ${colors.ORANGE()}`,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      width: 300,
    },
  },
  coinStackIcon: {
    marginLeft: 4,
    height: 12,
    width: 12,
    "@media only screen and (max-width: 500px)": {
      height: 10,
      width: 10,
    },
  },
  emptyStateSummary: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 3,
    padding: "25px 0",
    border: `1px solid #F0F0F0`,
    backgroundColor: "#FBFBFD",
    cursor: "pointer",
    ":hover": {
      borderColor: colors.BLUE(),
    },
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
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryTab);
