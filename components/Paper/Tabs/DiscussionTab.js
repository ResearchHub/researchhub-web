import { Fragment, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder";

// Components
import TextEditor from "~/components/TextEditor";
import Message from "~/components/Loader/Message";
import Loader from "~/components/Loader/Loader";
import DiscussionEntry from "../../Threads/DiscussionEntry";
import PaperPlaceholder from "~/components/Placeholders/PaperPlaceholder";
import DropdownButton from "~/components/Form/DropdownButton";

// Dynamic modules
import dynamic from "next/dynamic";
const AddDiscussionModal = dynamic(() =>
  import("~/components/Modals/AddDiscussionModal")
);
const PostingGuidelinesModal = dynamic(() =>
  import("~/components/Threads/PostingGuidelinesModal")
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
import { genClientId } from "~/config/utils/id";
import { breakpoints } from "~/config/themes/screen";
import { POST_TYPES } from "~/components/TextEditor/config/postTypes";
import getReviewCategoryScore from "~/components/TextEditor/util/getReviewCategoryScore";
import Bounty from "~/config/types/bounty";

const discussionScaffoldInitialValue = Value.fromJSON(discussionScaffold);

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
    getThreads,
    paperId,
    isCollapsible,
    post,
    postId,
    hypothesis,
    hypothesisId,
    handleAwardBounty,
    showBountyBtn,
    setHasBounties,
    setAllBounties,
    setThreadProp,
  } = props;

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
  const [filterDropdownIsOpen, setFilterDropdownIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [page, setPage] = useState(1);
  const [showTwitterComments, toggleTwitterComments] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [focus, setFocus] = useState(false);
  const [bountyMap, setBountyMap] = useState({});
  const [showPostingGuidelinesModal, setShowPostingGuidelinesModal] =
    useState(false);
  const [textEditorKey, setTextEditorKey] = useState(genClientId());

  function handleAcceptedAnswer(e) {
    let updatedThreads = [...threads];
    if (e.detail.multiAward) {
      e.detail.multiAward.forEach((award) => {
        const curThreadId = parseInt(award.detail.threadId, 10);

        updatedThreads = updatedThreads.map((t) => {
          if (t.id === curThreadId) {
            t.is_accepted_answer = true;
          }

          return t;
        });
      });
    } else {
      const newAnswerId = parseInt(e.detail.threadId, 10);

      updatedThreads = threads.map((t) => {
        if (t.id === newAnswerId) {
          t.is_accepted_answer = true;
        } else if (t.id !== newAnswerId && t.is_accepted_answer === true) {
          t.is_accepted_answer = false;
        }

        return t;
      });
    }

    setThreads(updatedThreads);
    setFormattedThreads(formatThreads(threads, basePath));
    setThreadProp && setThreadProp(formatThreads(threads, basePath));
  }

  function handleAwardedBounty(e) {
    let updatedThreads = [...threads];
    if (e.detail.multiAward) {
      let threadIndex = null;
      if (e.detail.commentBountyAward) {
        const commentAwardMap = {};
        e.detail.multiAward.forEach((award) => {
          commentAwardMap[award.objectId] = award.amount;
        });

        updatedThreads = updatedThreads.map((t, index) => {
          if (t.id === e.detail.bountyThreadId) {
            t.bounties[0].status = "CLOSED";
            threadIndex = index;
          }

          return t;
        });

        updatedThreads[threadIndex].comments = updatedThreads[
          threadIndex
        ].comments.map((comment) => {
          const awardedAmount = commentAwardMap[comment.id];
          if (awardedAmount) {
            if (comment.awarded_bounty_amount) {
              comment.awarded_bounty_amount =
                parseFloat(comment.awarded_bounty_amount) +
                parseFloat(awardedAmount + "" || "0");
            } else {
              comment.awarded_bounty_amount = parseFloat(
                awardedAmount + "" || "0"
              );
            }
          }
        });
      } else {
        e.detail.multiAward.forEach((award) => {
          const awardedObjectId = award.objectId;
          const awardedAmount = award.amount;
          updatedThreads = updatedThreads.map((t) => {
            if (t.id === awardedObjectId) {
              if (t.awarded_bounty_amount) {
                t.awarded_bounty_amount =
                  parseFloat(t.awarded_bounty_amount) +
                  parseFloat(awardedAmount + "" || "0");
              } else {
                t.awarded_bounty_amount = parseFloat(awardedAmount + "" || "0");
              }
            }

            return t;
          });
        });
      }

      debugger;
    } else {
      const awardedThreadId = e.detail.objectId;
      const awardedAmount = e.detail.amount;

      updatedThreads = updatedThreads.map((t) => {
        if (t.id === awardedThreadId) {
          if (t.awarded_bounty_amount) {
            t.awarded_bounty_amount =
              parseFloat(t.awarded_bounty_amount) +
              parseFloat(awardedAmount + "" || "0");
          } else {
            t.awarded_bounty_amount = parseFloat(awardedAmount + "" || "0");
          }
        }

        return t;
      });
    }

    setThreads(updatedThreads);
    setFormattedThreads(formatThreads(threads, basePath));
    setThreadProp && setThreadProp(formatThreads(threads, basePath));
  }

  function handleDiscussionDeleted(e) {
    const { deletedId, deletedContentType } = e.detail;

    for (let i = 0; i < threads.length; i++) {
      const thread = threads[i];

      if (deletedContentType === "thread" && deletedId === thread.id) {
        thread.is_removed = true;
        break;
      }

      for (let j = 0; j < (thread.comments || []).length; j++) {
        const comment = thread.comments[j];

        if (deletedContentType === "comment" && deletedId === comment.id) {
          comment.is_removed = true;
          break;
        }

        for (let k = 0; k < (comment.replies || []).length; k++) {
          const reply = comment.replies[k];

          if (deletedContentType === "reply" && deletedId === reply.id) {
            reply.is_removed = true;
            break;
          }
        }
      }
    }

    // Forces refresh of discussion section
    setFetching(true);
    setFetching(false);
  }

  useEffect(() => {
    document.addEventListener("answer-accepted", handleAcceptedAnswer);
    document.addEventListener("bounty-awarded", handleAwardedBounty);
    document.addEventListener("discussion-deleted", handleDiscussionDeleted);

    return () => {
      document.removeEventListener("bounty-awarded", handleAwardedBounty);
      document.removeEventListener("answer-accepted", handleAcceptedAnswer);
      document.removeEventListener(
        "discussion-deleted",
        handleDiscussionDeleted
      );
    };
  }, [threads]);

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
              ? threads.map((thread, i) => {
                  const { path, data } = thread;
                  const formattedThreadData =
                    data?.source === "citation_comment"
                      ? { ...data, text: data.text?.content ?? null }
                      : data;

                  return (
                    <DiscussionEntry
                      key={`thread-${formattedThreadData.id}`}
                      {...formattedThreadData}
                      bounties={props.bounties}
                      commentBounties={
                        formattedThreadData.bounties.length
                          ? formattedThreadData.bounties
                          : bountyMap[formattedThreadData.id]
                          ? [bountyMap[formattedThreadData.id]]
                          : []
                      }
                      data={formattedThreadData}
                      hostname={hostname}
                      hoverEvents
                      path={path}
                      index={i}
                      newCard={transition && i === 0} //conditions when a new card is made
                      mobileView={mobileView}
                      discussionCount={calculatedCount}
                      setCount={setCount}
                      documentType={documentType}
                      paper={paperState}
                      post={post}
                      bountyType={props.bountyType}
                      currentAuthor={props?.auth?.user?.author_profile}
                      hypothesis={hypothesis}
                      onVote={({ score, index, voteType }) => {
                        const newThreads = [...threads];

                        newThreads[index].data.score = score;
                        newThreads[index].data.user_vote.vote_type = voteType;
                        setThreadProp && setThreadProp(newThreads);
                      }}
                      isAcceptedAnswer={formattedThreadData.is_accepted_answer}
                      handleAwardBounty={handleAwardBounty}
                    />
                  );
                })
              : showTwitterComments && (
                  <span className={css(styles.box, styles.emptyStateBox)}>
                    <span className={css(styles.icon, styles.twitterIcon)}>
                      {icons.twitter}
                    </span>
                    <h3 className={css(styles.noSummaryTitle)}>
                      There are no tweets {mobileView && "\n"}for this paper
                      yet.
                    </h3>
                  </span>
                )}
          </ReactPlaceholder>
        </div>
      </div>
    );
  }

  const handleFilterChange = (filter) => {
    setFilter(filter);
    setPage(1);
  };

  const getFilterOptions = () => {
    const options = [
      {
        value: "-score",
        label: "Top",
        default: true,
      },
      {
        value: "-created_date",
        label: "Most Recent",
      },
      {
        value: "created_date",
        label: "Oldest",
      },
    ];

    return options.map((o) => {
      o.isSelected = o.value === filter;
      return o;
    });
  };

  const cancel = () => {
    setSubmitInProgress(false);
    setDiscussion(initialDiscussionState);
    setEditorDormant(true);
    setFocus(false);
    setTextEditorKey(genClientId());
    props.openAddDiscussionModal(false);
  };

  const save = async ({
    content,
    plainText,
    callback,
    discussionType,
    interimBounty,
  }) => {
    setSubmitInProgress(true);
    let param;
    let documentId;
    let unifiedDocumentId;

    if (documentType === "paper") {
      documentId = router.query.paperId;
      unifiedDocumentId = props.paperState.unified_document.id;
      param = {
        text: content,
        paper: paperId,
        plain_text: plainText,
      };
    } else if (
      documentType === "post" ||
      documentType === "question" ||
      documentType === "bounty"
    ) {
      documentId = router.query.documentId;
      unifiedDocumentId = props.post.unified_document.id;
      param = {
        text: content,
        post: documentId,
        plain_text: plainText,
      };
    } else if (documentType === "hypothesis") {
      documentId = router.query.documentId;
      unifiedDocumentId = props.hypothesis.unified_document;
      param = {
        text: content,
        hypothesis: documentId,
        plain_text: plainText,
      };
    }

    if (discussionType === POST_TYPES.REVIEW) {
      const reviewScore = getReviewCategoryScore({
        quillContents: content,
        category: "overall",
      });
      if (reviewScore === 0) {
        props.showMessage({ show: true, error: true });
        props.setMessage("Rating cannot be empty");
        setSubmitInProgress(false);
        return;
      }

      let reviewResponse;
      try {
        reviewResponse = await saveReview({
          unifiedDocumentId,
          review: { score: reviewScore },
        });
      } catch (error) {
        setSubmitInProgress(false);
        captureEvent({
          error,
          msg: "Failed to save review",
          data: { reviewScore, quillContents: content },
        });
        props.setMessage("Something went wrong");
        props.showMessage({ show: true, error: true });
        return false;
      }

      param["review"] = reviewResponse.id;
    }

    param["discussion_post_type"] = discussionType || POST_TYPES.DISCUSSION;
    let config = API.POST_CONFIG(param);

    return fetch(
      API.DISCUSSION({ documentId, documentType, twitter: null }),
      config
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(async (resp) => {
        setSubmitInProgress(false);
        props.showMessage({ show: false });
        props.setMessage("");
        props.showMessage({ show: true, error: false });
        // update state & redux
        let newDiscussion = { ...resp };

        setThreads([newDiscussion, ...threads]);
        let formattedDiscussion = createFormattedDiscussion(newDiscussion);
        setFormattedThreads([formattedDiscussion, ...formattedThreads]);
        setThreadProp &&
          setThreadProp([formattedDiscussion, ...formattedThreads]);
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
        setTextEditorKey(genClientId());
        sendAmpEvent(payload);

        if (interimBounty) {
          const bounty = await Bounty.createAPI({
            bountyAmount: interimBounty.amount,
            itemObjectId: resp.id,
            itemContentType: "thread",
          });
          const newBountyMap = { ...bountyMap };
          newBountyMap[resp.id] = bounty;
          onBountyCreate(newBountyMap);
        }
      })
      .catch((err) => {
        setSubmitInProgress(false);
        if (err?.response?.status === 429) {
          props.showMessage({ show: false });
          return props.openRecaptchaPrompt(true);
        }
        props.showMessage({ show: true });
        props.setMessage("Something went wrong");
        props.showMessage({ show: true, error: true });
      });
  };

  const onBountyCreate = (newBountyMap) => {
    setBountyMap(newBountyMap);
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

    let newDocumentType = documentType;

    if (newDocumentType === "bounty") {
      newDocumentType = "post";
    }

    const res = await getThreads({
      documentId,
      documentType: newDocumentType,
      document: props.paper,
      filter,
      loadMore,
      twitter: showTwitterComments,
    });

    const threads = res.payload.threads;
    let hasBounties = false;
    const allBounties = [];
    threads.forEach((thread) => {
      if (thread.bounties.length) {
        hasBounties = true;
        thread.bounties[0].threadId = thread.id;
        allBounties.push(thread.bounties[0]);
      }
    });

    if (hasBounties) {
      setHasBounties && setHasBounties(hasBounties);
      setAllBounties && setAllBounties(allBounties);
    }
    setFetching(false);
    setLoading(false);
    setThreads(threads);
    setFormattedThreads(formatThreads(threads, basePath));
    setThreadProp && setThreadProp(formatThreads(threads, basePath));
  };

  const editor = (
    <TextEditor
      canEdit
      commentEditor
      commentEditorStyles={styles.commentEditorStyles}
      focusEditor={focus}
      initialValue={discussion.question}
      onCancel={cancel}
      showBountyBtn={showBountyBtn}
      onSubmit={save}
      readOnly={false}
      loading={submitInProgress}
      uid={textEditorKey}
      isTopLevelComment={true}
      documentType={documentType}
    ></TextEditor>
  );

  const discussionTextEditor = !showEditor ? (
    renderAddDiscussion()
  ) : (
    <div className={css(stylesEditor.box)}>
      <Message />
      <div className={css(stylesEditor.discussionInputWrapper)}>
        <div
          className={css(stylesEditor.discussionTextEditor)}
          onClick={() => editorDormant && setEditorDormant(false)}
        >
          {editor}
        </div>
      </div>
    </div>
  );

  const filterOptions = getFilterOptions();
  const selectedFilter =
    filterOptions.find((f) => f.isSelected) ||
    filterOptions.find((f) => f.default);
  return (
    <Fragment>
      <PostingGuidelinesModal
        isOpen={showPostingGuidelinesModal}
        closeModal={() => setShowPostingGuidelinesModal(false)}
      />
      <AddDiscussionModal
        handleDiscussionTextEditor={handleDiscussionTextEditor}
        discussion={discussion}
        handleInput={handleInput}
        cancel={cancel}
        save={save}
      />
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
          </h3>
          <div className={css(styles.filterContainer)}>
            <div>
              <DropdownButton
                opts={filterOptions}
                labelAsHtml={
                  <div>
                    <span className={css(styles.typeFilterText)}>
                      {selectedFilter.label}
                    </span>
                  </div>
                }
                selected={selectedFilter.value}
                isOpen={filterDropdownIsOpen}
                onClick={() => setFilterDropdownIsOpen(true)}
                dropdownClassName="filter"
                onClickOutside={() => {
                  setFilterDropdownIsOpen(false);
                }}
                positions={["bottom", "right"]}
                customButtonClassName={[styles.dropdownButtonOverride]}
                overrideTitleStyle={styles.dropdownOption}
                onSelect={(selected) => {
                  handleFilterChange(selected);
                }}
                onClose={() => setFilterDropdownIsOpen(false)}
              />
            </div>
          </div>
        </div>
        <span className={css(styles.subtitle)}>
          Leave a comment or write a review
        </span>
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
    // backgroundColor: "#FFF",

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
  subtitle: {
    color: colors.MEDIUM_GREY(),
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
  discussionThreadContainer: {},
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
    color: colors.NEW_BLUE(),
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
    alignItems: "start",
    width: "100%",
    marginBottom: 5,
  },
  discussionTitle: {
    display: "flex",
    margin: 0,
  },
  discussionCount: {
    color: colors.BLACK(),
    background: colors.LIGHTER_GREY(),
    borderRadius: "3px",
    padding: "3px 10px",
    // border: `1px solid ${colors.GREY()}`,
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 10,
    alignSelf: "center",
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
    marginTop: 0,
    fontWeight: 500,
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
  discussionToggleContainer: {
    display: "flex",
    alignItems: "flex-start",
  },
  discussionTypeHeaderContainer: {
    display: "none",
    justifyContent: "space-between",
    marginBottom: 20,
    [`@media only screen and (max-width: 400px)`]: {
      justifyContent: "center",
    },
  },
  discussionTypeHeader: {
    fontSize: 16,
    fontWeight: 500,
    alignSelf: "center",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 16,
    },
    [`@media only screen and (max-width: 400px)`]: {
      display: "none",
    },
  },
  dropdownButtonOverride: {
    display: "flex",
  },
  dropdownOption: {
    fontWeight: 400,
  },
  postingGuidelinesLink: {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    ":hover": {
      opacity: 0.8,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      fontSize: 14,
    },
    [`@media only screen and (max-width: 400px)`]: {
      display: "none",
    },
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
  },
  container: {
    width: "100%",
  },
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginBottom: 5,
    marginTop: 35,
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  discussionTextEditor: {
    width: "100%",
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
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionTab);
