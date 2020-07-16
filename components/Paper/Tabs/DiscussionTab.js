import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Plain from "slate-plain-serializer";
import Ripples from "react-ripples";
import { isAndroid, isMobile } from "react-device-detect";
import ReactPlaceholder from "react-placeholder";
var isAndroidJS = false;
if (process.browser) {
  const ua = navigator.userAgent.toLowerCase();
  isAndroidJS = ua && ua.indexOf("android") > -1;
}

// Components
import ComponentWrapper from "../../ComponentWrapper";
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import AddDiscussionModal from "~/components/modal/AddDiscussionModal";
import TextEditor from "~/components/TextEditor";
import Message from "~/components/Loader/Message";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import DiscussionEntry from "../../Threads/DiscussionEntry";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";

// Redux
import { MessageActions } from "~/redux/message";
import { thread } from "~/redux/discussion/shims";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import discussionScaffold from "~/components/Paper/discussionScaffold.json";
import { doesNotExist, endsWithSlash } from "~/config/utils";
const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

const DiscussionTab = (props) => {
  const initialDiscussionState = {
    question: discussionScaffoldInitialValue,
  };

  let { hostname, paper, discussionCount, setCount, discussionRef } = props;

  if (doesNotExist(props.threads)) {
    props.threads = [];
  }

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
  const dispatch = useDispatch();
  const store = useStore();
  const basePath = formatBasePath(router.asPath);
  const [formattedThreads, setFormattedThreads] = useState(
    formatThreads(paper.discussion.threads, basePath)
  );
  const [transition, setTransition] = useState(false);
  const [addView, toggleAddView] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [editorDormant, setEditorDormant] = useState(false);
  const [discussion, setDiscussion] = useState(initialDiscussionState);
  const [mobileView, setMobileView] = useState(false);
  const [threads, setThreads] = useState(props.threads);
  const [filter, setFilter] = useState("-score");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showTwitterComments, toggleTwitterComments] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(resetThreadsEffect, [props.threads]);

  function resetThreadsEffect() {
    setThreads(props.threads);
    setFormattedThreads(formatThreads(props.threads, basePath));
  }

  useEffect(() => {
    setFetching(true);
    async function getThreadsByFilter() {
      const currentPaper = store.getState().paper;
      await dispatch(
        PaperActions.getThreads({
          paperId: props.paper.id,
          paper: currentPaper,
          filter,
          page: 1,
          twitter: showTwitterComments,
        })
      );
      const sortedThreads = store.getState().paper.discussion.threads;
      setThreads(sortedThreads);
      setFormattedThreads(formatThreads(sortedThreads, basePath));
      setFetching(false);
    }
    if (filter !== null) {
      getThreadsByFilter();
    }
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
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [filter, showTwitterComments]);

  function renderThreads(threads) {
    if (!Array.isArray(threads)) {
      threads = [];
    }

    if (fetching) {
      return (
        <div className={css(styles.placeholderContainer)}>
          <div className={css(styles.placeholder)}>
            <ReactPlaceholder
              ready={false}
              showLoadingAnimation
              customPlaceholder={<PaperPlaceholder color="#efefef" />}
            />
          </div>
        </div>
      );
    } else {
      if (threads.length > 0) {
        return (
          threads &&
          threads.map((t, i) => {
            if (!showTwitterComments) {
              if (t.data.source !== "twitter") {
                return (
                  <DiscussionEntry
                    key={`${t.key}-disc${i}`}
                    data={t.data}
                    hostname={hostname}
                    hoverEvents={true}
                    path={t.path}
                    newCard={transition && i === 0} //conditions when a new card is made
                    mobileView={mobileView}
                    index={i}
                    discussionCount={store.getState().paper.discussion.count}
                    setCount={setCount}
                  />
                );
              }
            } else {
              if (t.data.source === "twitter") {
                return (
                  <DiscussionEntry
                    key={`${t.key}-disc${i}`}
                    data={t.data}
                    hostname={hostname}
                    hoverEvents={true}
                    path={t.path}
                    newCard={transition && i === 0} //conditions when a new card is made
                    mobileView={mobileView}
                    index={i}
                    discussionCount={store.getState().paper.discussion.count}
                    setCount={setCount}
                  />
                );
              }
            }
          })
        );
      } else {
        if (showTwitterComments) {
          return (
            <span className={css(styles.box, styles.emptyStateBox)}>
              <span className={css(styles.icon, styles.twitterIcon)}>
                <i className="fab fa-twitter" />
              </span>
              <h2 className={css(styles.noSummaryTitle)}>
                There are no tweets {mobileView && "\n"}for this paper yet.
              </h2>
            </span>
          );
        }
      }
    }
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
    document.body.style.overflow = "scroll";
    props.openAddDiscussionModal(false);
  };

  const save = async (text, plain_text) => {
    let { paperId } = router.query;
    props.showMessage({ load: true, show: true });

    let param = {
      // title: discussion.title,
      text: text,
      paper: paperId,
      plain_text: plain_text,
    };

    let config = await API.POST_CONFIG(param);

    return fetch(API.DISCUSSION({ paperId, twitter: null }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        let newDiscussion = { ...resp };
        newDiscussion = thread(newDiscussion);
        setThreads([newDiscussion, ...threads]);
        let formattedDiscussion = createFormattedDiscussion(newDiscussion);
        setFormattedThreads([formattedDiscussion, ...formattedThreads]);
        setTimeout(() => {
          props.showMessage({ show: false });
          props.setMessage("Successfully Saved!");
          props.showMessage({ show: true });
          props.setCount(props.discussionCount + 1);
          cancel();
          props.checkUserFirstTime(!props.auth.user.has_seen_first_coin_modal);
          props.getUser();
        }, 800);
      })
      .catch((err) => {
        setTimeout(() => {
          props.showMessage({ show: false });
          props.setMessage("Something went wrong");
          props.showMessage({ show: true, error: true });
        }, 800);
      });
  };

  const createFormattedDiscussion = (newDiscussion) => {
    let discussionObject = {
      data: newDiscussion,
      key: newDiscussion.id,
      path: `/paper/${newDiscussion.paper}/discussion/${newDiscussion.id}`,
    };
    return discussionObject;
  };

  const handleInput = (id, value) => {
    let newDiscussion = { ...discussion };
    newDiscussion[id] = value;
    setDiscussion(newDiscussion);
  };

  const handleDiscussionTextEditor = (editorState) => {
    let newDiscussion = { ...discussion };
    newDiscussion.question = editorState;
    setDiscussion(newDiscussion);
  };

  const openAddDiscussionModal = () => {
    props.openAddDiscussionModal(true);
  };

  const fetchDiscussionThreads = async () => {
    if (
      loading ||
      formattedThreads.length >= store.getState().paper.discussion.count
    ) {
      return;
    }
    setLoading(true);
    const currentPaper = store.getState().paper;
    await dispatch(
      PaperActions.getThreads({
        paperId: props.paper.id,
        paper: currentPaper,
        filter,
        twitter: showTwitterComments,
        loadMore: true,
      })
    );
    const sortedThreads = store.getState().paper.discussion.threads;

    setThreads(sortedThreads);
    setFormattedThreads(formatThreads(sortedThreads, basePath));
    setLoading(false);
  };

  const renderAddDiscussion = () => {
    return (
      <div
        className={css(
          styles.box,
          !fetching && threads.length < 1 && styles.emptyStateBox
        )}
      >
        {discussionCount < 1 && (
          <span className={css(styles.box, styles.emptyStateBox)}>
            <span className={css(styles.icon)}>
              <i className="fad fa-comments" />
            </span>
            <h2 className={css(styles.noSummaryTitle)}>
              There are no comments {mobileView && "\n"}for this paper yet.
            </h2>
            <div className={css(styles.text)}>
              Please add a comment to this paper
            </div>
          </span>
        )}

        <PermissionNotificationWrapper
          onClick={() => {
            setShowEditor(true);
          }}
          modalMessage="create a discussion thread"
          permissionKey="CreateDiscussionThread"
          loginRequired={true}
        >
          <button
            className={css(
              styles.addDiscussionButton,
              discussionCount > 0 && styles.plainButton
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
              // hideButton={editorDormant}
              placeholder={"Leave a question or a comment"}
              initialValue={discussion.question}
              commentEditor={true}
              smallToolBar={true}
              onCancel={cancel}
              onSubmit={save}
              commentEditorStyles={styles.commentEditorStyles}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
      <AddDiscussionModal
        handleDiscussionTextEditor={handleDiscussionTextEditor}
        discussion={discussion}
        handleInput={handleInput}
        cancel={cancel}
        save={save}
      />
      {discussionCount > 0 ? (
        <div
          className={css(
            styles.threadsContainer,
            styles.discussionThreadContainer
          )}
          ref={discussionRef}
        >
          <div className={css(styles.header)}>
            <div className={css(styles.discussionTitle)}>
              Comments
              <span className={css(styles.discussionCount)}>
                {fetching ? (
                  <Loader
                    key={"discussionLoader"}
                    loading={true}
                    size={2}
                    color={"rgba(36, 31, 58, 0.5)"}
                    type="beat"
                  />
                ) : showTwitterComments ? (
                  store.getState().paper.discussion.count
                ) : (
                  Math.max(
                    discussionCount,
                    store.getState().paper.discussion.count
                  )
                )}
              </span>
              <div className={css(styles.tabRow)}>
                <div
                  className={css(
                    styles.tab,
                    !showTwitterComments && styles.activeTab
                  )}
                  onClick={() => toggleTwitterComments(false)}
                >
                  Comments
                </div>
                <div
                  className={css(
                    styles.tab,
                    showTwitterComments && styles.activeTab
                  )}
                  onClick={() => toggleTwitterComments(true)}
                >
                  Tweets
                </div>
              </div>
            </div>
            {!showEditor && !showTwitterComments && renderAddDiscussion()}
          </div>
          <div className={css(styles.box, !addView && styles.right)}>
            <div className={css(styles.addDiscussionContainer)}>
              {showEditor &&
                !showTwitterComments &&
                renderDiscussionTextEditor()}
            </div>
            <div className={css(styles.rowContainer)}>
              <div className={css(styles.filterContainer)}>
                <div className={css(styles.filterSelect)}>
                  <FormSelect
                    id={"thread-filter"}
                    options={filterOptions}
                    defaultValue={filterOptions[2]}
                    placeholder={"Sort Threads"}
                    onChange={handleFilterChange}
                    containerStyle={styles.overrideFormSelect}
                    inputStyle={{
                      minHeight: "unset",
                      padding: 0,
                      backgroundColor: "#FFF",
                      fontSize: 14,
                      width: 150,
                      "@media only screen and (max-width: 415px)": {
                        fontSize: 12,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {renderThreads(formattedThreads, hostname)}
          {store.getState().paper.discussion.next && !fetching && (
            <div className={css(styles.buttonContainer)}>
              {loading ? (
                <Loader
                  loading={true}
                  key={`thread-loader`}
                  size={10}
                  type="beat"
                />
              ) : (
                <Ripples
                  className={css(styles.loadMoreButton)}
                  onClick={fetchDiscussionThreads}
                >
                  Load More
                </Ripples>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={css(styles.addDiscussionContainer, styles.emptyState)}
          ref={discussionRef}
        >
          <div className={css(styles.header)}>
            <div className={css(styles.discussionTitle)}>Comments</div>
          </div>
          {showEditor ? renderDiscussionTextEditor() : renderAddDiscussion()}
        </div>
      )}
    </ComponentWrapper>
  );
};

function formatBasePath(path) {
  if (endsWithSlash(path)) {
    return path;
  }
  return path + "/";
}

function formatThreads(threads, basePath) {
  return threads.map((thread) => {
    return {
      key: thread.id,
      data: thread,
      path: basePath + thread.id,
    };
  });
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
      width: "100%",
      fontSize: 16,
      marginBottom: 0,
    },
  },
  emptyStateBox: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
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
  },
  addDiscussionButton: {
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
      fontSize: 12,
    },
  },
  plainButton: {
    marginTop: 0,
    border: "none",
    height: "unset",
    color: "rgba(26, 31, 58, 0.6)",
    padding: "3px 0px 3px 5px",
    fontSize: 14,
    ":hover": {
      backgroundColor: "#FFF",
      color: colors.PURPLE(),
      textDecoration: "underline",
    },
    "@media only screen and (max-width: 767px)": {
      marginTop: 5,
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
  discussionTextEditor: {
    width: 600,
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
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
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
  },
  addDiscussionContainer: {
    transition: "all ease-in-out 0.3s",
    opacity: 1,
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      height: "unset",
    },
  },
  emptyState: {
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
  transition: {
    padding: 1,
    border: `1px solid ${colors.BLUE(1)}`,
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
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
    marginBottom: 20,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    "@media only screen and (max-width: 415px)": {
      marginBottom: 10,
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
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
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
  placholder: {
    width: "100%",
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
    border: "1px solid #E8E8F2",
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
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openAddDiscussionModal: ModalActions.openAddDiscussionModal,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionTab);
