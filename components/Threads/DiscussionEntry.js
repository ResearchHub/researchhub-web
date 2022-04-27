import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "../VoteWidget";
import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import CommentEntry from "./CommentEntry";
import ThreadTextEditor from "./ThreadTextEditor";
import InlineCommentContextTitle from "../InlineCommentDisplay/InlineCommentContextTitle";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { checkVoteTypeChanged } from "~/config/utils/reputation";
import { getNestedValue } from "~/config/utils/misc";
import { saveReview } from "~/config/fetch";

// Redux
import DiscussionActions from "../../redux/discussion";
import { MessageActions } from "~/redux/message";
import { createUsername } from "~/config/utils/user";
import ScoreInput from "../Form/ScoreInput";

class DiscussionEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealComment: true,
      comments: [],
      hovered: false,
      score: 0,
      selectedVoteType: "",
      highlighted: false,
      // Pagination
      page: 2, // we assume page 1 is already present
      fetching: false, // when true, we show loading state,
      // Removed
      removed: false,
      // Edit
      canEdit: false,
      editing: false,
      // Review
      isReview: false,
      review: null,
    };
    this.divRef = null;
  }

  componentDidMount = async () => {
    const { data, newCard } = this.props;

    const comments = data.comments || [];
    const selectedVoteType = getNestedValue(data, ["user_vote", "vote_type"]);
    this.setState(
      {
        comments,
        score: data.score,
        selectedVoteType,
        revealComment: comments.length > 0 && comments.length < 6,
        highlight: this.shouldHighlight(),
        removed: this.props.data.is_removed,
        isReview: data?.review?.id ? true : false,
        review: data?.review,
        canEdit:
          data.source !== "twitter"
            ? this.props.auth.user.id === data.created_by.id
            : false,
      },
      () => {
        newCard &&
          setTimeout(() => {
            this.setState({ highlight: false }, () => {
              this.props.newCard = false;
            });
          }, 10000);
      }
    );
  };

  shouldHighlight = () => {
    const { newCard, currentAuthor, data, context } = this.props;
    const isCurrentAuthor =
      currentAuthor?.id === data.created_by.author_profile.id;
    const comments = data.comments || [];

    if (newCard) {
      return true;
    } else if (isCurrentAuthor && context === "DOCUMENT") {
      return true;
    } else if (
      isCurrentAuthor &&
      context === "AUTHOR_PROFILE" &&
      comments.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate = async (prevProps, prevState) => {
    this.handleVoteTypeUpdate(prevProps);
    if (prevProps.auth !== this.props.auth) {
      let { data } = this.props;
      this.setState({
        canEdit:
          data.source !== "twitter"
            ? this.props.auth.user.id === data.created_by.id
            : false,
      });
    }
  };

  handleVoteTypeUpdate = (prevProps) => {
    const stateToSet = {};

    const nextSelectedVoteType = this.getNextSelectedVoteType(prevProps);
    const nextCommentVoteType = this.getNextCommentVoteType(prevProps);
    const nextComments = this.getNextComments();

    if (nextSelectedVoteType !== undefined) {
      // If this component's vote has changed, downstream votes *may* have
      // changed too, so we update the state of the downstream children.
      stateToSet["selectedVoteType"] = nextSelectedVoteType;
      stateToSet["comments"] = nextComments;
    }
    if (nextCommentVoteType !== undefined) {
      // In this case we *know* the downstream votes have changed.
      stateToSet["comments"] = nextComments;
    }

    // Update state only if we detect a difference
    if (Object.keys(stateToSet).length > 0) {
      this.setState({
        ...stateToSet,
      });
    }
  };

  getNextSelectedVoteType = (prevProps) => {
    return checkVoteTypeChanged(prevProps.data, this.props.data);
  };

  getNextCommentVoteType = (prevProps) => {
    const prevComment = getNestedValue(prevProps, ["data", "comments"], [])[0];
    const nextComments = this.getNextComments();
    return checkVoteTypeChanged(prevComment, nextComments[0]);
  };

  getNextComments = () => {
    return getNestedValue(this.props, ["data", "comments"], []);
  };

  fetchComments = (e) => {
    e && e.stopPropagation();
    this.setState(
      {
        fetching: true,
      },
      () => {
        let { data, documentType } = this.props;
        let discussionThreadId = data.id;
        let paperId = data.paper;
        let page = this.state.page;

        fetch(
          API.THREAD_COMMENT(documentType, paperId, discussionThreadId, page),
          API.GET_CONFIG()
        )
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.setState({
              comments: [...this.state.comments, ...res.results],
              page: this.state.page + 1,
              fetching: false,
            });
          })
          .catch((err) => {
            let { setMessage, showMessage } = this.props;
            setMessage("Hm something went wrong");
            showMessage({ show: true, error: true, clickoff: true });
            this.setState({ fetching: false });
          });
      }
    );
  };

  submitComment = async (text, plain_text, callback) => {
    let {
      data,
      postComment,
      postCommentPending,
      discussionCount,
      setCount,
      documentType,
      post,
      hypothesis,
    } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    postCommentPending();
    await postComment(
      documentType,
      paperId,
      documentId,
      discussionThreadId,
      text,
      plain_text
    );
    if (this.props.discussion.donePosting && this.props.discussion.success) {
      let newComment = { ...this.props.discussion.postedComment };
      newComment.highlight = true;
      let comments = [...this.state.comments, newComment];
      data.comments = comments;
      setCount && setCount(discussionCount + 1);
      this.setState(
        {
          comments,
          revealComment: true,
        },
        () => {
          callback && callback();
        }
      );
    } else {
      callback && callback();
    }
  };

  onSaveError = async (error) => {
    let { showMessage, setMessage } = this.props;

    setMessage("Something went wrong");
    showMessage({ show: true, error: true });
  };

  saveEditsThread = async (text, plain_text, callback) => {
    let {
      data,
      updateThread,
      updateThreadPending,
      post,
      hypothesis,
      documentType,
    } = this.props;

    const { review, isReview } = this.state;

    let discussionThreadId = data.id;
    let paperId = data.paper;
    let unifiedDocumentId = data.unified_document.id;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    let body = {
      text,
      plain_text,
      paper: paperId,
    };

    if (isReview) {
      const response = await saveReview({
        unifiedDocumentId,
        review: this.state.review,
      });
      this.setState({ review: response });
    }

    updateThreadPending();
    try {
      await updateThread(
        documentType,
        paperId,
        documentId,
        discussionThreadId,
        body
      );
    } catch (error) {
      return Promise.reject(error);
    }

    if (this.props.discussion.doneUpdating && this.props.discussion.success) {
      callback();
      this.setState({ editing: false });
    } else {
      return Promise.reject();
    }
  };

  toggleCommentView = (e) => {
    e && e.stopPropagation();
    this.setState({
      revealComment: !this.state.revealComment,
    });
  };

  toggleHover = (e) => {
    e && e.stopPropagation();
    this.setState({ hovered: !this.state.hovered });
  };

  toggleEdit = () => {
    this.setState({ editing: !this.state.editing });
  };

  onScoreSelect = (value) => {
    this.setState({ review: { ...this.state.review, score: value } });
  };

  onRemove = ({ paperID, threadID, commentID, replyID, postID }) => {
    this.setState({ removed: true });
    this.props.onRemoveSuccess &&
      this.props.onRemoveSuccess({
        postID,
        commentID,
        paperID,
        replyID,
        threadID,
      });
  };

  renderComments = () => {
    let {
      data,
      hostname,
      path,
      discussionCount,
      setCount,
      paper,
      mediaOnly,
      post,
      hypothesis,
      documentType,
      currentAuthor,
      noVote,
    } = this.props;
    let comments = this.state.comments;

    if (comments.length > 0) {
      return comments.map((comment, i) => {
        return (
          <CommentEntry
            data={data}
            noVote={noVote}
            hostname={hostname}
            currentAuthor={currentAuthor}
            path={path}
            key={`comment_${comment.id}`}
            comment={comment}
            paper={paper}
            index={i}
            mobileView={this.props.mobileView}
            discussionCount={discussionCount}
            setCount={setCount}
            mediaOnly={mediaOnly}
            post={post}
            hypothesis={hypothesis}
            documentType={documentType}
          />
        );
      });
    }
  };

  renderViewMore = () => {
    if (this.state.comments.length < this.props.data.commentCount) {
      let fetching = this.state.fetching;
      let totalCount = this.props.data?.commentCount ?? 0;
      let currentCount = this.state.comments?.length ?? 0;
      let fetchCount =
        totalCount - currentCount >= 10 ? 10 : totalCount - currentCount;
      return (
        <div className={css(styles.viewMoreContainer)}>
          <div
            className={css(styles.viewMoreButton)}
            onClick={!fetching ? this.fetchComments : null}
          >
            {fetching ? (
              <span className={css(styles.loadingText)}>loading...</span>
            ) : (
              `View ${fetchCount} More`
            )}
          </div>
        </div>
      );
    }
  };

  upvote = async () => {
    let {
      data,
      postUpvote,
      postUpvotePending,
      post,
      hypothesis,
      documentType,
    } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    postUpvotePending();

    await postUpvote(documentType, paperId, documentId, discussionThreadId);

    this.updateWidgetUI(this.props.voteResult);
  };

  downvote = async () => {
    let {
      data,
      postDownvote,
      postDownvotePending,
      post,
      hypothesis,
      documentType,
    } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    postDownvotePending();

    await postDownvote(documentType, paperId, documentId, discussionThreadId);

    this.updateWidgetUI();
  };

  updateWidgetUI = () => {
    let voteResult = this.props.vote;
    const success = voteResult.success;
    const vote = getNestedValue(voteResult, ["vote"], false);

    if (success) {
      const voteType = vote.voteType;
      let score = this.state.score;
      if (voteType === UPVOTE) {
        if (voteType) {
          if (this.state.selectedVoteType === null) {
            // this is how we determine if it's the user's first vote
            score += 1;
          } else {
            score += 2;
          }
        } else {
          score += 1;
        }
        this.setState({
          selectedVoteType: UPVOTE,
          score,
        });
      } else if (voteType === DOWNVOTE) {
        if (voteType) {
          if (this.state.selectedVoteType === null) {
            score -= 1;
          } else {
            score -= 2;
          }
        } else {
          score -= 1;
        }
        this.setState({
          selectedVoteType: DOWNVOTE,
          score,
        });
      }
    }
  };

  render() {
    const {
      data,
      data: { context_title: contextTitle, id: commentThreadID },
      documentType,
      hostname,
      hypothesis,
      mediaOnly,
      mobileView,
      noRespond,
      noVote,
      noVoteLine,
      paper,
      path,
      post,
      shouldShowContextTitle = true,
      store: inlineCommentStore,
    } = this.props;

    const { review, isReview } = this.state;

    const commentCount =
      data.comment_count +
        data.comments
          ?.map((comment) => comment.reply_count)
          .reduce((a, b) => a + b, 0) || 0;
    const date = data.created_date;
    const title = data.title;
    const body = data.source === "twitter" ? data.plain_text : data.text;
    const username = createUsername(data);
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }
    const metaData = {
      authorId: data.created_by.author_profile.id,
      threadId: data.id,
      paperId: data.paper,
      documentId: documentId,
      userFlag: data.user_flag,
      contentType: "thread",
      objectId: data.id,
    };

    return (
      <div
        className={css(
          styles.discussionCard,
          this.props.withBorder && styles.withBorder,
          this.props.withPadding && styles.withPadding
        )}
      >
        {noVote ? null : (
          <div className={css(styles.column, styles.left)}>
            <div className={css(styles.voteContainer)}>
              <VoteWidget
                score={this.state.score}
                styles={styles.voteWidget}
                onUpvote={this.upvote}
                onDownvote={this.downvote}
                selected={this.state.selectedVoteType}
                type={"Discussion"}
                fontSize={"16px"}
                width={"44px"}
                promoted={false}
              />
              <div
                className={css(
                  styles.threadLineContainer,
                  noVoteLine && styles.hidden
                )}
                onClick={this.toggleCommentView}
              >
                <div className={css(styles.threadline)} />
              </div>
            </div>
          </div>
        )}
        <div
          className={css(styles.column)}
          ref={(element) => (this.divRef = element)}
        >
          <div
            className={css(
              styles.mainContent,
              styles.metaData,
              this.state.highlight && styles.highlight
            )}
          >
            {!this.state.removed ? (
              <Fragment>
                <div className={css(styles.row, styles.topbar)}>
                  <DiscussionPostMetadata
                    authorProfile={
                      data &&
                      getNestedValue(
                        data,
                        ["created_by", "author_profile"],
                        null
                      )
                    }
                    isCreatedByEditor={data?.is_created_by_editor}
                    data={data}
                    date={date}
                    documentType={documentType}
                    dropDownEnabled={true}
                    hostname={hostname}
                    paper={paper}
                    post={post}
                    threadPath={path}
                    username={username}
                    // Moderator
                    metaData={metaData}
                    onRemove={this.onRemove}
                    // Twitter
                    twitter={data.source === "twitter"}
                    twitterUrl={data.url}
                  />
                </div>
                {shouldShowContextTitle && contextTitle ? (
                  <InlineCommentContextTitle
                    commentThreadID={commentThreadID}
                    entityKey={null}
                    onScrollSuccess={() => {
                      inlineCommentStore.set("displayableInlineComments")([
                        {
                          blockKey: "Blockkey-placeholder",
                          commentThreadID,
                          entityKey: "EntityKey-placeholder",
                          highlightedText: contextTitle,
                        },
                      ]);
                    }}
                    title={contextTitle}
                  />
                ) : null}
                <div
                  className={css(
                    styles.content,
                    this.state.editing && styles.contentEdit
                  )}
                >
                  {isReview ? (
                    <div className={css(styles.reviewContainer)}>
                      <div className={css(styles.reviewBadge)}>Review</div>
                      <ScoreInput
                        value={review?.score}
                        readOnly={this.state.editing ? false : true}
                        onSelect={this.onScoreSelect}
                        scoreInputStyleOverride={styles.scoreInputStyleOverride}
                        overrideBarStyle={styles.overrideBar}
                      />
                    </div>
                  ) : null}
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    body={true}
                    textStyles={styles.contentText}
                    editing={this.state.editing}
                    onEditCancel={this.toggleEdit}
                    onEditSubmit={this.saveEditsThread}
                    onError={this.onSaveError}
                  />
                </div>
              </Fragment>
            ) : (
              <div className={css(styles.content)}>
                <div className={css(styles.removedText)}>
                  Discussion Removed By Moderator
                </div>
              </div>
            )}
            {noRespond ? null : (
              <div className={css(styles.row, styles.bottom)}>
                <ThreadActionBar
                  editing={this.state.editing}
                  toggleEdit={this.state.canEdit && this.toggleEdit}
                  title={title}
                  count={commentCount}
                  showChildrenState={this.state.revealComment}
                  onSubmit={this.submitComment}
                  onClick={this.toggleCommentView}
                  onCountHover={this.toggleHover}
                  mediaOnly={mediaOnly}
                  small={noVoteLine}
                  isRemoved={this.state.removed}
                  hideReply={data.source === "twitter"}
                />
              </div>
            )}
          </div>
          <div className={css(styles.commentContainer)} id={"comments"}>
            {this.state.revealComment && (
              <Fragment>
                {this.renderComments()}
                {this.renderViewMore()}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: "100%",
  },
  threadline: {
    height: "100%",
    width: 2,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "#EEEFF1",
    ":hover": {
      backgroundColor: colors.BLUE(1),
    },
  },
  threadLineContainer: {
    padding: 8,
    paddingTop: 0,
    paddingBottom: 0,
    height: "calc(100% - 80px)",
    cursor: "pointer",
  },
  hoverThreadline: {
    backgroundColor: colors.BLUE(),
  },
  activeThreadline: {
    backgroundColor: colors.BLUE(0.3),
  },
  left: {
    alignItems: "center",
    width: 48,
    display: "table-cell",
    height: "100%",
    verticalAlign: "top",
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
  },
  voteContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  discussionCard: {
    width: "100%",
    maxWidth: "100%",
    alignItems: "flex-start",
    overflow: "visible",
    borderRadius: 4,
    position: "relative",
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    paddingRight: 0,
    cursor: "default",
    justifyContent: "space-between",
    display: "table",
    tableLayout: "fixed",
    height: "100%",
    borderSpacing: 0,
  },
  topbar: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    overflowWrap: "break-word",
    lineHeight: 1.6,
  },
  contentEdit: {
    border: `1px soild`,
    borderColor: "rgb(170, 170, 170)",
  },
  contentText: {
    fontSize: 16,
    padding: 0,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  metaData: {
    width: "100%",
    boxSizing: "border-box",
    display: "table-cell",
    height: "100%",
  },
  mainContent: {
    width: "100%",
    padding: "10px 10px 8px 8px",
    boxSizing: "border-box",
    marginLeft: 2,
  },
  highlight: {
    padding: "10px 10px 10px 15px",
    backgroundColor: colors.LIGHT_BLUE(0.2),
    borderRadius: 5,
    marginBottom: 10,
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 10,
      paddingRight: 5,
      paddingBottom: 5,
    },
  },
  hidden: {
    display: "none",
  },
  bottom: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    margin: 0,
    padding: 0,
    marginBottom: 10,
  },
  body: {
    margin: 0,
    fontSize: 16,
  },
  commentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
    cursor: "default",
  },
  voteWidget: {
    margin: 0,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
  },
  viewMoreContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 8,
    marginLeft: 20,
  },
  viewMoreButton: {
    fontSize: 13,
    fontWeight: 400,
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  loadingText: {
    color: colors.BLUE(),
  },
  removedText: {
    fontSize: 16,
    color: "rgb(35, 32, 56)",
    fontStyle: "italic",
  },
  withPadding: {
    padding: 16,
    height: "unset",
  },
  reviewContainer: {
    display: "flex",
    alignItems: "end",
    lineHeight: 1.4,
    marginBottom: 15,
  },
  reviewBadge: {
    background: colors.NEW_BLUE(),
    color: "white",
    padding: "2px 6px",
    fontWeight: 500,
    fontSize: 12,
    marginRight: 10,
    borderRadius: "2px",
    lineHeight: "15px",
  },
  overrideBar: {
    width: 16,
    height: 10,
  },
  scoreInputStyleOverride: {
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  discussion: state.discussion,
  // paper: state.paper,
  vote: state.vote,
  auth: state.auth,
});

const mapDispatchToProps = {
  postComment: DiscussionActions.postComment,
  postCommentPending: DiscussionActions.postCommentPending,
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
  updateThread: DiscussionActions.updateThread,
  updateThreadPending: DiscussionActions.updateThreadPending,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionEntry);
