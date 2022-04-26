import { Fragment, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder";

// Components
import PermissionNotificationWrapper from "../../PermissionNotificationWrapper";
import TextEditor from "~/components/TextEditor";
import Message from "~/components/Loader/Message";
import FormSelect from "~/components/Form/FormSelect";
import ScoreInput from "~/components/Form/ScoreInput";
import Loader from "~/components/Loader/Loader";
import DiscussionEntry from "../../Threads/DiscussionEntry";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";
import Toggle from "~/components/Form/Toggle";

// Dynamic modules
import dynamic from "next/dynamic";
const AddDiscussionModal = dynamic(() =>
  import("~/components/Modals/AddDiscussionModal")
);

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";
import { PaperActions } from "~/redux/paper";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import discussionScaffold from "~/components/Paper/discussionScaffold.json";
import { endsWithSlash } from "~/config/utils/routing";
import { sendAmpEvent, saveReview } from "~/config/fetch";
import { captureEvent } from "~/config/utils/events";
import { isEmpty } from "~/config/utils/nullchecks";
import { genClientId } from "~/config/utils/id";
const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

const TYPES = {
  COMMENT: "COMMENT",
  REVIEW: "REVIEW",
};

const DiscussionTab = (props) => {
  const initialDiscussionState = {
    question: discussionScaffoldInitialValue,
  };

  let {
    hostname,
    documentType,
    paper,
    paperState,
    calculatedCount,
    setCount,
    discussionRef,
    getThreads,
    getPostThreads,
    getHypothesisThreads,
    paperId,
    isCollapsible,
    post,
    postId,
    hypothesis,
    hypothesisId,
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
  const [formattedThreads, setFormattedThreads] = useState(
    formatThreads(paper.threads, basePath)
  );
  const [transition, setTransition] = useState(false);
  const [addView, toggleAddView] = useState(false);
  const [expandComments, setExpandComments] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [editorDormant, setEditorDormant] = useState(false);
  const [discussion, setDiscussion] = useState(initialDiscussionState);
  const [mobileView, setMobileView] = useState(false);
  const [threads, setThreads] = useState([]);
  const [filter, setFilter] = useState("-score");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showTwitterComments, toggleTwitterComments] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [focus, setFocus] = useState(false);
  const [discussionType, setDiscussionType] = useState(TYPES.COMMENT);
  const [reviewScore, setReviewScore] = useState(0);
  const [textEditorKey, setTextEditorKey] = useState(genClientId());

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    fetchDiscussionThreads(false, true);
  }, [filter, showTwitterComments, paperId, postId, hypothesisId]);

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
    if (!Array.isArray(threads)) {
      threads = [];
    }

    if (!expandComments && isCollapsible) {
      threads = threads.slice(0, 2);
    }

    return (
      <div className={css(styles.placeholderContainer)}>
        <div className={css(styles.placeholder)}>
          <ReactPlaceholder
            ready={!fetching}
            showLoadingAnimation
            customPlaceholder={<PaperPlaceholder color="#efefef" />}
          >
            {threads.length > 0
              ? threads.map((t, i) => {
                  return (
                    <DiscussionEntry
                      key={`thread-${t.data.id}`}
                      data={t.data}
                      hostname={hostname}
                      hoverEvents={true}
                      path={t.path}
                      newCard={transition && i === 0} //conditions when a new card is made
                      mobileView={mobileView}
                      discussionCount={calculatedCount}
                      setCount={setCount}
                      documentType={documentType}
                      paper={paperState}
                      post={post}
                      currentAuthor={props?.auth?.user?.author_profile}
                      hypothesis={hypothesis}
                      context="DOCUMENT"
                    />
                  );
                })
              : showTwitterComments && (
                  <span className={css(styles.box, styles.emptyStateBox)}>
                    <span className={css(styles.icon, styles.twitterIcon)}>
                      {icons.twitter}
                    </span>
                    <h2 className={css(styles.noSummaryTitle)}>
                      There are no tweets {mobileView && "\n"}for this paper
                      yet.
                    </h2>
                  </span>
                )}
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
    setReviewScore(0);
    props.openAddDiscussionModal(false);
  };

  const save = async (text, plain_text) => {
    let param;
    let documentId;
    let unifiedDocumentId;
    if (documentType === "paper") {
      documentId = router.query.paperId;
      unifiedDocumentId = props.paperState.unified_document_id;
      param = {
        text: text,
        paper: paperId,
        plain_text: plain_text,
      };
    } else if (documentType === "post") {
      documentId = router.query.documentId;
      unifiedDocumentId = props.post.unified_document_id;
      param = {
        text: text,
        post: documentId,
        plain_text: plain_text,
      };
    } else if (documentType === "hypothesis") {
      documentId = router.query.documentId;
      unifiedDocumentId = props.hypothesis.unified_document_id;
      param = {
        text: text,
        hypothesis: documentId,
        plain_text: plain_text,
      };
    }

    if (discussionType === TYPES.REVIEW) {
      if (reviewScore === 0) {
        props.showMessage({ show: true, error: true });
        props.setMessage("Rating cannot be empty");
        return;
      }

      let reviewResponse;
      try {
        reviewResponse = await saveReview({
          unifiedDocumentId,
          review: { score: reviewScore },
        });
      } catch (error) {
        captureEvent({
          error,
          msg: "Failed to save review",
          data: { reviewScore },
        });
        props.setMessage("Something went wrong");
        props.showMessage({ show: true, error: true });
        return false;
      }

      param["review"] = reviewResponse.id;
    }

    props.showMessage({ load: true, show: true });
    let config = API.POST_CONFIG(param);

    return fetch(
      API.DISCUSSION({ documentId, documentType, twitter: null }),
      config
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        props.showMessage({ show: false });
        props.setMessage("");
        props.showMessage({ show: true, error: false });
        // update state & redux
        let newDiscussion = { ...resp };

        setThreads([newDiscussion, ...threads]);
        let formattedDiscussion = createFormattedDiscussion(newDiscussion);
        setFormattedThreads([formattedDiscussion, ...formattedThreads]);
        cancel();

        // amp events
        let payload = {
          event_type: "create_thread",
          time: +new Date(),
          user_id: props.auth.user
            ? props.auth.user.id && props.auth.user.id
            : null,
          insert_id: `thread_${resp.id}`,
          event_properties: {
            interaction: "Post Thread",
            paper: documentId,
            is_removed: resp.is_removed,
          },
        };

        props.setCount(props.calculatedCount + 1);
        props.checkUserFirstTime(!props.auth.user.has_seen_first_coin_modal);
        props.getUser();
        sendAmpEvent(payload);
      })
      .catch((err) => {
        if (err.response.status === 429) {
          props.showMessage({ show: false });
          return props.openRecaptchaPrompt(true);
        }
        props.showMessage({ show: false });
        props.setMessage("Something went wrong");
        props.showMessage({ show: true, error: true });
      });
  };

  const createFormattedDiscussion = (newDiscussion) => {
    if (newDiscussion.key) return;
    let discussionObject = {
      data: newDiscussion,
      key: newDiscussion.id,
      path: `/paper/${newDiscussion.paper}/discussion/${newDiscussion.id}`,
    };
    return discussionObject;
  };

  const calculateCount = () => {
    let count = paper.threadCount;
    return count;
  };

  const calculateHiddenCount = () => {
    let hiddenCount = 0;
    for (const thread of formattedThreads.slice(2)) {
      hiddenCount +=
        1 +
        thread.data.comments.length +
        thread.data.comments
          .map((comment) => comment.replies.length)
          .reduce((a, b) => a + b, 0);
    }
    return hiddenCount;
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

  const fetchDiscussionThreads = async (loadMore = false, isFilter = false) => {
    if (loading) {
      return;
    }
    if (isFilter) {
      setFetching(true);
    }
    setLoading(true);

    let documentId;
    if (documentType === "paper") {
      documentId = router.query.paperId;
    } else {
      documentId = router.query.documentId;
    }
    const res = await getThreads({
      documentId,
      documentType,
      document: props.paper,
      filter,
      loadMore,
      twitter: showTwitterComments,
    });

    const threads = res.payload.threads;
    setFetching(false);
    setLoading(false);
    setThreads(threads);
    setFormattedThreads(formatThreads(threads, basePath));
  };

  const renderAddDiscussion = () => {
    return (
      <div
        className={css(
          styles.box,
          !fetching && threads.length < 1 && styles.emptyStateBox
        )}
        onClick={() => {
          setShowEditor(true);
          setFocus(true);
        }}
      >
        {threads.length < 1 && (
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
          onClick={() => {
            setShowEditor(true);
            setFocus(true);
          }}
          modalMessage="create a discussion thread"
          permissionKey="CreateDiscussionThread"
          loginRequired={true}
        >
          <button
            className={css(
              styles.addDiscussionButton,
              threads.length > 0 && styles.plainButton
            )}
          >
            Add Comment
          </button>
        </PermissionNotificationWrapper>
      </div>
    );
  };

  const editorPlaceholder =
    discussionType === TYPES.REVIEW
      ? `Review one or more aspects of this paper such as readability, methodologies, data, ... \nBe objective and constructive.`
      : `Engage the community and author by leaving a comment.\n- Avoid comments like "Thanks", "+1" or "I agree".\n- Be constructive and/or inquisitive.`;

  const editor = (
    <TextEditor
      canEdit
      commentEditor
      commentEditorStyles={styles.commentEditorStyles}
      focusEditor={focus}
      initialValue={discussion.question}
      onCancel={cancel}
      onSubmit={save}
      placeholder={editorPlaceholder}
      readOnly={false}
      smallToolBar
      uid={textEditorKey}
    />
  );

  const discussionTextEditor = !showEditor ? (
    renderAddDiscussion()
  ) : (
    <div className={css(stylesEditor.box)}>
      <Message />
      <div className={css(stylesEditor.discussionInputWrapper)}>
        <div className={css(styles.discussionTypeHeaderContainer)}>
          <div className={css(styles.discussionTypeHeader)}>
            {discussionType === TYPES.COMMENT
              ? "Write a comment"
              : "Write a peer review"}
          </div>
          <div className={css(styles.dicussionToggleContainer)}>
            <Toggle
              options={[
                { label: "Comment", value: TYPES.COMMENT },
                { label: "Peer Review", value: TYPES.REVIEW },
              ]}
              selected={discussionType}
              onSelect={(selected) => setDiscussionType(selected.value)}
            />
          </div>
        </div>
        {discussionType == TYPES.REVIEW && (
          <div className={css(styles.reviewDetails)}>
            <div className={css(styles.reviewHeader)}>Overall Rating</div>
            <ScoreInput
              onSelect={(value) => {
                setReviewScore(value);
              }}
              value={reviewScore}
            />
          </div>
        )}

        <div
          className={css(stylesEditor.discussionTextEditor)}
          onClick={() => editorDormant && setEditorDormant(false)}
        >
          {editor}
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <AddDiscussionModal
        handleDiscussionTextEditor={handleDiscussionTextEditor}
        discussion={discussion}
        handleInput={handleInput}
        cancel={cancel}
        save={save}
      />
      {calculatedCount > 0 ? (
        <div
          className={css(
            styles.threadsContainer,
            styles.discussionThreadContainer
          )}
        >
          <div className={css(styles.header)}>
            <h3 className={css(styles.discussionTitle)}>
              Discussion
              <span className={css(styles.discussionCount)}>
                {fetching ? (
                  <Loader loading={true} size={10} />
                ) : showTwitterComments ? (
                  calculateCount()
                ) : (
                  props.calculatedCount
                )}
              </span>
              {!showEditor && !showTwitterComments && renderAddDiscussion()}
            </h3>
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
          <div className={css(styles.box, !addView && styles.right)}>
            <div className={css(styles.addDiscussionContainer)}>
              {!showTwitterComments && discussionTextEditor}
            </div>
          </div>
          {renderThreads(formattedThreads, hostname)}
          {formattedThreads.length > 2 && isCollapsible ? (
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
          ) : (
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
            </div>
          )}
        </div>
      ) : (
        <div className={css(styles.addDiscussionContainer, styles.emptyState)}>
          <div className={css(styles.header)}>
            <div className={css(styles.discussionTitle)}>
              Discussion
              <span className={css(styles.discussionCount)}>
                {fetching ? (
                  <Loader
                    loading={true}
                    size={2}
                    color={"rgba(36, 31, 58, 0.5)"}
                    type="beat"
                  />
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
          {discussionTextEditor}
          {renderThreads(formattedThreads, hostname)}
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
    "@media only screen and (max-width: 415px)": {
      padding: "25px 15px",
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
    margin: 0,
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  discussionCount: {
    color: colors.BLACK(),
    background: colors.LIGHTER_GREY(),
    borderRadius: "3px",
    padding: "3px 10px",
    border: `1px solid ${colors.GREY()}`,
    fontSize: 14,
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
  dicussionToggleContainer: {
    display: "flex",
  },
  discussionTypeHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  discussionTypeHeader: {
    fontSize: 18,
    fontWeight: 500,
    alignSelf: "center",
  },
  reviewDetails: {
    marginBottom: 20,
    display: "flex",
  },
  reviewHeader: {
    fontSize: 15,
    marginRight: 20,
  },
});

const stylesEditor = StyleSheet.create({
  visibilityHidden: {
    visibility: "hidden",
  },
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
    paddingLeft: 20,
    marginTop: 15,
    boxSizing: "border-box",
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
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openAddDiscussionModal: ModalActions.openAddDiscussionModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  checkUserFirstTime: AuthActions.checkUserFirstTime,
  getUser: AuthActions.getUser,
  getThreads: PaperActions.getThreads,
  getPostThreads: PaperActions.getPostThreads,
  getHypothesisThreads: PaperActions.getHypothesisThreads,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionTab);
