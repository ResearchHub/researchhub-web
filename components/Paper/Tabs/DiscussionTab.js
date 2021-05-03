import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder";

// Components
import ComponentWrapper from "../../ComponentWrapper";
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import AddDiscussionModal from "~/components/Modals/AddDiscussionModal";
import TextEditor from "~/components/TextEditor";
import Message from "~/components/Loader/Message";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import DiscussionEntry from "../../Threads/DiscussionEntry";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";
import DiscussionCount from "~/components/Paper/PaperDiscussionCount";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";
import DiscussionActions from "~/redux/discussion";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import discussionScaffold from "~/components/Paper/discussionScaffold.json";
import { endsWithSlash } from "~/config/utils";
import { sendAmpEvent } from "~/config/fetch";
const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

const DiscussionTab = (props) => {
  const initialDiscussionState = {
    question: discussionScaffoldInitialValue,
  };

  const {
    hostname,
    paper,
    getThreads,
    paperId,
    updateThreadCount,
    threads, // paper redux
    updateThreads, // paper redux action
  } = props;

  // TODO: move to config
  const filterOptions = [
    {
      value: "-created_date",
      label: "Most Recent",
    },
    {
      value: "created_date",
      label: "Oldest",
    },
    {
      value: "-score",
      label: "Top",
    },
  ];

  const router = useRouter();
  const basePath = formatBasePath(router.asPath);
  const [transition, setTransition] = useState(false);
  const [addView, toggleAddView] = useState(false);
  const [expandComments, setExpandComments] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [editorDormant, setEditorDormant] = useState(false);
  const [discussion, setDiscussion] = useState(initialDiscussionState);
  const [mobileView, setMobileView] = useState(false);
  const [filter, setFilter] = useState("-score");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [focus, setFocus] = useState(false);

  const doThreadsExist = threads.length > 0;

  useEffect(() => {
    fetchDiscussionThreads(false);
  }, [paperId]);

  useEffect(() => {
    fetchDiscussionThreads(false, true);
  }, [filter, showTwitterComments, paperId]);

  function handleWindowResize() {
    if (window.innerWidth < 436) {
      if (!mobileView) {
        setMobileView(true);
      }
    } else {
      if (mobileView) {
        setMobileView(false);
      }
    }
  }

  function renderThreads(threads = []) {
    return (
      <div className={css(styles.placeholderContainer)}>
        <div className={css(styles.placeholder)}>
          <ReactPlaceholder
            ready={!isFetching}
            showLoadingAnimation
            customPlaceholder={<PaperPlaceholder color="#efefef" />}
          >
            {doThreadsExist &&
              threads.map((thread, i) => {
                const { id } = thread;
                return (
                  <DiscussionEntry
                    key={`thread-${id}`}
                    data={thread}
                    hostname={hostname}
                    hoverEvents={true}
                    path={basePath + id}
                    isNewCard={transition && i === 0} //conditions when a new card is made
                    paper={props.paperState}
                  />
                );
              })}
          </ReactPlaceholder>
        </div>
      </div>
    );
  }

  const handleFilterChange = (id, filter) => {
    let { value } = filter;
    setFilter(value);
    setPage(1);
  };

  const cancel = () => {
    setDiscussion(initialDiscussionState);
    setEditorDormant(true);
    setShowEditor(false);
    setFocus(false);
    document.body.style.overflow = "scroll";
    props.openAddDiscussionModal(false);
  };

  const showStateMessage = (state = "pending") => {
    const { showMessage, setMessage } = props;

    showMessage({ show: false });

    if (state === "success") {
      setMessage("Successfully Saved!");
      return showMessage({ show: true });
    }

    if (state === "error") {
      setMessage("Something went wrong");
      return showMessage({ show: true, error: true });
    }

    return showMessage({ load: true, show: true });
  };

  const postAMPEvent = (discussion) => {
    const { checkUserFirstTime, getUser } = props;

    const AMP_ANALYTIC_PAYLOAD = {
      event_type: "create_thread",
      time: +new Date(),
      user_id: props.auth.user
        ? props.auth.user.id && props.auth.user.id
        : null,
      insert_id: `thread_${discussion.id}`,
      event_properties: {
        interaction: "Post Thread",
        paper: paperId,
        is_removed: discussion.is_removed,
      },
    };

    sendAmpEvent(AMP_ANALYTIC_PAYLOAD);
    checkUserFirstTime(!props.auth.user.has_seen_first_coin_modal); // check if first
    getUser(); // get user's updated balance & state
  };

  const save = (text, plain_text) => {
    const { paperId } = router.query;

    const param = {
      text: text,
      paper: paperId,
      plain_text: plain_text,
    };

    const config = API.POST_CONFIG(param);

    showStateMessage("pending");
    return fetch(API.DISCUSSION({ paperId, twitter: null }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((newDiscussion) => {
        showStateMessage("success");
        updateThreads([newDiscussion, ...threads]);
        postAMPEvent(newDiscussion);
        cancel(); // closes discussion editor after post
      })
      .catch((err) => {
        console.log("err", err);
        const { response } = err;
        if (response && response.status === 429) {
          showMessage({ show: false });
          return props.openRecaptchaPrompt(true);
        }
        showStateMessage("error");
      });
  };

  const handleInput = (id, value) => {
    const newDiscussion = { ...discussion };
    newDiscussion[id] = value;
    setDiscussion(newDiscussion);
  };

  const handleDiscussionTextEditor = (editorState) => {
    let newDiscussion = { ...discussion };
    newDiscussion.question = editorState;
    setDiscussion(newDiscussion);
  };

  const fetchDiscussionThreads = async (loadMore = false, isFilter = false) => {
    if (isLoading) {
      return;
    }

    setIsFetching(true);
    setIsLoading(true);
    const currentPaper = props.paper;
    await getThreads({
      paperId: paperId,
      paper: currentPaper,
      filter,
      loadMore,
      twitter: false,
    });
    setIsFetching(false);
    setIsLoading(false);
  };

  const renderAddDiscussion = () => {
    return (
      <div
        className={css(
          styles.box,
          !isFetching && !doThreadsExist && styles.emptyStateBox
        )}
        onClick={() => {
          setShowEditor(true);
          setFocus(true);
        }}
      >
        {!doThreadsExist && (
          <Fragment>
            <span className={css(styles.icon)}>{icons.comments}</span>
            <h2 className={css(styles.noSummaryTitle)}>
              Ask a question for the author or community
            </h2>
            <p className={css(styles.text)}>
              Contribute a thought or post a question for this paper.
            </p>
          </Fragment>
        )}
        <PermissionNotificationWrapper
          modalMessage="create a discussion thread"
          permissionKey="CreateDiscussionThread"
          loginRequired={true}
          onClick={() => {
            setShowEditor(true);
            setFocus(true);
          }}
        >
          <button
            className={css(
              styles.addDiscussionButton,
              doThreadsExist && styles.plainButton
            )}
          >
            Add Comment
          </button>
        </PermissionNotificationWrapper>
      </div>
    );
  };

  const renderDiscussionTextEditor = () => {
    return (
      <div className={css(stylesEditor.box)}>
        <Message />
        <div className={css(stylesEditor.discussionInputWrapper)}>
          <div
            className={css(stylesEditor.discussionTextEditor)}
            onClick={() => editorDormant && setEditorDormant(false)}
          >
            <TextEditor
              canEdit={true}
              readOnly={false}
              onChange={handleDiscussionTextEditor}
              placeholder={
                "Leave a question or a comment for the Author of the paper or the community"
              }
              initialValue={discussion.question}
              commentEditor={true}
              smallToolBar={true}
              onCancel={cancel}
              onSubmit={save}
              commentEditorStyles={styles.commentEditorStyles}
              focusEditor={focus}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <AddDiscussionModal
        handleDiscussionTextEditor={handleDiscussionTextEditor}
        discussion={discussion}
        handleInput={handleInput}
        cancel={cancel}
        save={save}
      />

      {doThreadsExist ? (
        <div
          className={css(
            styles.threadsContainer,
            styles.discussionThreadContainer
          )}
        >
          <div className={css(styles.header)}>
            <h3 className={css(styles.discussionTitle)}>
              Comments
              <span className={css(styles.discussionCount)}>
                <DiscussionCount isFetching={isFetching} />
              </span>
            </h3>
            {!showEditor && renderAddDiscussion()}
          </div>
          <div className={css(styles.box, !addView && styles.right)}>
            <div className={css(styles.addDiscussionContainer)}>
              {showEditor && renderDiscussionTextEditor()}
            </div>
          </div>
          {renderThreads(formattedThreads, hostname)}
          {formattedThreads.length > 2 ? (
            expandComments ? (
              <div>
                {props.paper.nextDiscussion && !fetching && (
                  <div className={css(styles.buttonContainer)}>
                    {loading ? (
                      <Loader loading={true} size={10} type="beat" />
                    ) : (
                      <Ripples
                        className={css(styles.loadMoreButton)}
                        onClick={() => fetchDiscussionThreads(true)}
                      >
                        Load More
                      </Ripples>
                    )}
                  </div>
                )}
                <div className={css(styles.expandDiv)}>
                  <button
                    className={css(styles.expandButton)}
                    onClick={() => setExpandComments(false)}
                  >
                    See Fewer Comments
                  </button>
                </div>
              </div>
            ) : (
              <div className={css(styles.expandDiv)}>
                <button
                  className={css(styles.expandButton)}
                  onClick={() => setExpandComments(true)}
                >
                  View {calculateHiddenCount()} More Comment
                  {calculateHiddenCount() === 1 ? "" : "s"}
                </button>
              </div>
            )
          ) : null}
        </div>
      ) : (
        <div className={css(styles.addDiscussionContainer, styles.emptyState)}>
          <div className={css(styles.header)}>
            <div className={css(styles.discussionTitle)}>
              Comments
              <span className={css(styles.discussionCount)}>
                <DiscussionCount isFetching={isFetching} />
              </span>
            </div>
          </div>
          {showEditor ? renderDiscussionTextEditor() : renderAddDiscussion()}
          {renderThreads(threads, hostname)}
        </div>
      )}
    </Fragment>
  );
};

function formatBasePath(path) {
  if (endsWithSlash(path)) {
    return path;
  }
  return path + "/";
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
  },
  guidelines: {
    color: "rgba(36, 31, 58, 0.8)",
    textAlign: "center",
    letterSpacing: 0.7,
    marginBottom: 16,
    width: "100%",
  },
  boxContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "column",
  },
  box: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#FFF",

    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
      marginBottom: 0,
    },
  },
  emptyStateBox: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    borderRadius: 3,
    padding: "25px 0",
    border: `1px solid #F0F0F0`,
    backgroundColor: "#FBFBFD",
    cursor: "pointer",
    ":hover": {
      borderColor: colors.BLUE(),
    },
  },
  plainBox: {
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      fontSize: 16,
      backgroundColor: "#FFF",
    },
  },
  right: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    color: colors.BLACK(),
    width: "100%",
    textAlign: "left",
  },
  noSummaryTitle: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 415px)": {
      width: 250,
      fontSize: 16,
    },
  },
  text: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    margin: "0px 0px 20px",
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
  },
  addDiscussionButton: {
    border: "1px solid",
    marginLeft: 10,
    color: "#fff",
    background: colors.PURPLE(1),
    fontSize: 16,
    borderRadius: 5,
    height: 45,
    outline: "none",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  plainButton: {
    marginTop: 0,
    border: "none",
    height: "unset",
    color: "rgba(26, 31, 58, 0.6)",
    background: "unset",
    fontSize: 14,
    ":hover": {
      backgroundColor: "#FFF",
      color: colors.PURPLE(),
      textDecoration: "underline",
    },
  },
  expandDiv: {
    textAlign: "center",
  },
  expandButton: {
    marginTop: 10,
    cursor: "pointer",
    border: "none",
    color: colors.BLUE(1),
    background: "unset",
    fontSize: 14,
    ":hover": {
      backgroundColor: "#FFF",
      color: colors.PURPLE(),
      textDecoration: "underline",
    },
  },
  pencilIcon: {
    marginRight: 5,
  },
  discussionIcon: {
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
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  container: {
    width: 600,
    marginBottom: 20,
  },
  buttonRow: {
    width: "70%",
    minWidth: 820,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 40,
  },
  buttons: {
    justifyContent: "center",
  },
  button: {
    width: 180,
    height: 55,
    cursor: "pointer",
  },
  buttonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  discussionThreadContainer: {
    backgroundColor: "#fff",
    padding: 30,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  addDiscussionContainer: {
    // transition: "all ease-in-out 0.3s",
    opacity: 1,
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      height: "unset",
    },
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 30,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,

    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  transition: {
    padding: 1,
    border: `1px solid ${colors.BLUE(1)}`,
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
  },
  twitterIcon: {
    color: "#00ACEE",
  },
  asterick: {
    color: colors.BLUE(1),
  },
  componentWrapperStyles: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  threadsContainer: {},
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  discussionTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 22,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  discussionCount: {
    color: "rgba(36, 31, 58, 0.5)",
    fontSize: 17,
    fontWeight: 500,
    marginLeft: 15,
    marginTop: 3,
  },
  rowContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  overrideFormSelect: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: "#FFF",
    width: "unset",
    minHeight: 0,
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      marginBottom: 15,
    },
  },
  filterSelect: {
    width: 150,
  },
  filterText: {
    textTransform: "uppercase",
    height: "100%",
    letterSpacing: 0.5,
    fontSize: 10,
  },
  filterInput: {
    minHeight: "unset",
  },
  infiniteContainer: {
    display: "flex",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadMoreButton: {
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    marginBottom: 10,
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
  commentEditorStyles: {
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
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
  placeholderContainer: {
    marginTop: 15,
  },
});

const stylesEditor = StyleSheet.create({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  container: {
    width: "100%",
  },
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 5,
  },
  discussionTextEditor: {
    width: "100%",
    // border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  asterick: {
    color: colors.BLUE(1),
  },
  text: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: colors.BLACK(0.8),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  paper: state.paper,
  threads: state.paper.threads,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openAddDiscussionModal: ModalActions.openAddDiscussionModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
  // TODO: move everything to PaperActions (?)
  getThreads: PaperActions.getThreads,
  updateThreads: PaperActions.updateThreads,
  updateThreadCount: DiscussionActions.updateThreadCount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionTab);
