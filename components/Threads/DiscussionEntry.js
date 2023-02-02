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
import { UPVOTE, DOWNVOTE, NEUTRALVOTE } from "~/config/constants";
import { checkVoteTypeChanged } from "~/config/utils/reputation";
import { getNestedValue } from "~/config/utils/misc";
import { saveReview } from "~/config/fetch";
import { POST_TYPES } from "~/components/TextEditor/config/postTypes";
import getReviewCategoryScore from "~/components/TextEditor/util/getReviewCategoryScore";

// Redux
import DiscussionActions from "../../redux/discussion";
import { MessageActions } from "~/redux/message";
import { createUsername } from "~/config/utils/user";
import {
  neutralVote,
  postDownvote,
  postUpvote,
  updateDiscussion,
  updateThread,
} from "./api/fetchDiscussion";

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
      comment: this.props.data,
      // Edit
      canEdit: false,
      editing: false,
      // Review
      isReview: false,
      bounties: this.props.bounties,
      commentBounties: this.props.commentBounties,
      review: null,
      bountyAmount: 0,
    };
    this.divRef = null;
  }

  componentDidMount = async () => {
    const { data, newCard } = this.props;

    const comments = data.comments || [];
    let selectedVoteType = getNestedValue(data, ["user_vote", "vote_type"]);
    if (selectedVoteType === 1) {
      selectedVoteType = UPVOTE;
    } else if (selectedVoteType === 2) {
      selectedVoteType = DOWNVOTE;
    }
    this.setState(
      {
        comments,
        score: data.score,
        selectedVoteType,
        revealComment: comments.length > 0 && comments.length < 6,
        highlight: this.shouldHighlight(),
        removed: this.props.data.is_removed,
        // isReview: data?.review?.id ? true : false,
        // review: data?.review,
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

    if (context === "AUTHOR_PROFILE") {
      if (isCurrentAuthor && comments.length > 0) {
        return true;
      }
    } else if (context === "DOCUMENT") {
      return false;
    }

    return false;
  };

  componentDidUpdate = async (prevProps, prevState) => {
    this.handleVoteTypeUpdate(prevProps);

    if (prevProps.bounties !== this.props.bounties) {
      this.setState({
        bounties: this.props.bounties,
      });
    }

    if (prevProps.commentBounties !== this.props.commentBounties) {
      this.setState({
        commentBounties: this.props.commentBounties,
      });
    }
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

  submitComment = async ({ content, plainText, callback }) => {
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
    if (
      documentType === "post" ||
      documentType === "question" ||
      documentType === "bounty"
    ) {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    postCommentPending();
    const comment = await postComment(
      documentType,
      paperId,
      documentId,
      discussionThreadId,
      content,
      plainText
    );

    if (comment.payload.donePosting && comment.payload.success) {
      let newComment = { ...comment.payload.postedComment };
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

  saveEditsThread = async ({
    content,
    plainText,
    discussionType,
    callback,
  }) => {
    let { data, post, hypothesis, documentType } = this.props;

    let threadId = data.id;
    let paperId = data.paper;
    let unifiedDocumentId = data.unified_document.id;
    let documentId;

    if (
      documentType === "post" ||
      documentType === "question" ||
      documentType === "bounty"
    ) {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    let body = {
      text: content,
      plain_text: plainText,
      paper: paperId,
    };

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
          review: { score: reviewScore, id: data.review.id },
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

      // param["review"] = reviewResponse.id;
    }

    // if (isReview) {
    //   const response = await saveReview({
    //     unifiedDocumentId,
    //     review: this.state.review,
    //   });
    //   this.setState({ review: response });

    // }

    const thread = await updateDiscussion({
      documentType,
      paperId,
      documentId,
      threadId,
      body,
    });

    if (thread) {
      callback();
      this.setState({ editing: false, comment: thread });
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
      context,
    } = this.props;
    let comments = this.state.comments;

    if (comments.length > 0) {
      return comments.map((comment, i) => {
        return (
          <CommentEntry
            data={data}
            noVote={noVote}
            hostname={hostname}
            context={context}
            openBounties={this.state.commentBounties}
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
    let { data, post, hypothesis, documentType, dispatch } = this.props;

    console.log("--------------------");
    console.log("data", data);
    console.log("documentType", documentType);
    console.log("--------------------");

    const threadId = data.id;
    const paperId = data.paper;
    let documentId;
    if (
      documentType === "post" ||
      documentType === "question" ||
      documentType === "bounty"
    ) {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    const voteRes = await postUpvote({
      documentType,
      paperId,
      documentId,
      threadId,
      dispatch,
    });

    if (voteRes) {
      this.updateWidgetUI(voteRes);
    }
  };

  downvote = async () => {
    let { data, post, hypothesis, documentType, dispatch } = this.props;
    const threadId = data.id;
    const paperId = data.paper;
    let documentId;
    if (
      documentType === "post" ||
      documentType === "question" ||
      documentType === "bounty"
    ) {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    const voteRes = await postDownvote({
      documentType,
      paperId,
      documentId,
      threadId,
      dispatch,
    });

    if (voteRes) {
      this.updateWidgetUI(voteRes);
    }
  };

  neutralVote = async () => {
    let { data, post, hypothesis, documentType, dispatch } = this.props;
    const threadId = data.id;
    const paperId = data.paper;
    let documentId;
    if (
      documentType === "post" ||
      documentType === "question" ||
      documentType === "bounty"
    ) {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }

    const voteRes = await neutralVote({
      documentType,
      paperId,
      documentId,
      threadId,
      dispatch,
    });

    if (voteRes) {
      this.updateWidgetUI(voteRes);
    }
  };

  getDocumentID = () => {
    const { data, hypothesis, post } = this.props;
    return data?.paper ?? hypothesis?.id ?? post?.id;
  };

  updateWidgetUI = (vote) => {
    const voteType = vote.voteType;
    let selectedVoteType = null;
    const { onVote } = this.props;
    let score = this.state.score;
    if (voteType === UPVOTE) {
      if (voteType) {
        if (!this.state.selectedVoteType) {
          // this is how we determine if it's the user's first vote
          score += 1;
        } else {
          score += 2;
        }
      } else {
        score += 1;
      }
      selectedVoteType = UPVOTE;
      this.setState({
        selectedVoteType: UPVOTE,
        score,
      });
    } else if (voteType === DOWNVOTE) {
      if (voteType) {
        if (!this.state.selectedVoteType) {
          score -= 1;
        } else {
          score -= 2;
        }
      } else {
        score -= 1;
      }
      selectedVoteType = DOWNVOTE;
      this.setState({
        selectedVoteType: DOWNVOTE,
        score,
      });
    } else if (!voteType) {
      if (this.state.selectedVoteType === UPVOTE) {
        score -= 1;
      } else if (this.state.selectedVoteType === DOWNVOTE) {
        score += 1;
      }

      selectedVoteType = null;

      this.setState({
        selectedVoteType: null,
        score,
      });
    }

    onVote &&
      onVote({ score, index: this.props.index, voteType: selectedVoteType });
  };

  onBountyAward = ({ bountyAmount }) => {
    this.setState({
      bountyAmount,
    });
  };

  render() {
    const {
      data,
      data: {
        context_title: contextTitle,
        id: commentThreadID,
        discussion_post_type: postType,
      },
      documentType,
      hostname,
      mediaOnly,
      noRespond,
      noVote,
      noVoteLine,
      is_solution: isSolution,
      paper,
      path,
      post,
      bounty,
      isAcceptedAnswer,
      shouldShowContextTitle = true,
      store: inlineCommentStore,
      bountyType,
    } = this.props;

    const commentCount =
      data.comment_count +
        data.comments
          ?.map((comment) => comment.reply_count)
          .reduce((a, b) => a + b, 0) || 0;
    const date = data.created_date;
    const title = data.title;
    // Below needs to be cleaned up (Need to rewrite the entire module)
    const body =
      this.state.comment.source === "twitter"
        ? this.state.comment.plain_text
        : this.state.comment.text;

    const username = createUsername(data);
    const documentId = this.getDocumentID();
    const metaData = {
      authorId: data.created_by.author_profile.id,
      threadId: data.id,
      paperId: data.paper,
      documentId: documentId,
      userFlag: data.user_flag,
      contentType: "thread",
      objectId: data.id,
    };

    const { bounties } = this.state;
    const currentUser = this.props?.auth?.user;

    const userBounty =
      bounties &&
      bounties.find(
        (bounty) =>
          bounty?.createdBy?.id === currentUser.id ||
          bounty?.created_by?.id === currentUser.id
      );

    const showBountyAward =
      (documentType === "question" || documentType === "bounty") &&
      post?.created_by?.id === this.props?.auth?.user?.id &&
      userBounty?.status === "OPEN" &&
      (postType === POST_TYPES.ANSWER || documentType === "bounty");

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
                onNeutralVote={this.neutralVote}
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
                <div className={css(styles.threadline) + " threadline"} />
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
                    commentBounties={this.props.commentBounties}
                    bounties={this.state.bounties}
                    isCreatedByEditor={data?.is_created_by_editor}
                    data={data}
                    awardedBountyAmount={this.state.bountyAmount}
                    documentType={documentType}
                    date={date}
                    dropDownEnabled={true}
                    hostname={hostname}
                    bountyType={bountyType}
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
                  key={`thread_${data.id}`}
                  className={css(
                    styles.content,
                    isSolution && !this.state.editing && styles.acceptedAnswer,
                    this.state.editing && styles.contentEdit
                  )}
                >
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    focusEditor={true}
                    body={true}
                    textStyles={styles.contentText}
                    textEditorId={`thread_${data.id}`}
                    editing={this.state.editing}
                    onEditCancel={this.toggleEdit}
                    onEditSubmit={this.saveEditsThread}
                    onError={this.onSaveError}
                    isBounty={
                      bountyType !== "question" &&
                      this.state.commentBounties &&
                      this.state.commentBounties.length &&
                      this.state.commentBounties[0].status !== "CLOSED"
                    }
                    postType={postType}
                    isAcceptedAnswer={isAcceptedAnswer}
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
                  contentType="thread"
                  onBountyAward={this.onBountyAward}
                  count={commentCount}
                  documentID={documentId}
                  showBountyAward={showBountyAward}
                  documentType={this.props.documentType}
                  editing={this.state.editing}
                  hideReply={data.source === "twitter"}
                  isRemoved={this.state.removed}
                  mediaOnly={mediaOnly}
                  bounties={bounties}
                  onClick={this.toggleCommentView}
                  onCountHover={this.toggleHover}
                  onSubmit={this.submitComment}
                  showChildrenState={this.state.revealComment}
                  small={noVoteLine}
                  threadID={data?.id}
                  title={title}
                  bounty={bounty}
                  createdBy={data.created_by}
                  handleAwardBounty={this.props.handleAwardBounty}
                  toggleEdit={this.state.canEdit && this.toggleEdit}
                />

                {/*
                  Kobe: Commenting this out for now as it seems to be non-trivial to fix and ROI
                  on it is low atm. "expires in" shows across all comments in particular papers instead
                  of just the one pertaining to. Appears to be because data about the comment it is attached
                  to is missing.
                */}
                {/* {this.state.bounties &&
                  this.state.bounties.length > 0 &&
                  this.state.bounties[0].status == "OPEN" && (
                    <span className={css(styles.expiryDate)}>
                      <span className={css(styles.divider)}>•</span>
                      expires in{" "}
                      {timeToRoundUp(this.state.bounties[0].expiration_date)}
                    </span>
                  )} */}
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
  expiryDate: {
    color: colors.MEDIUM_GREY2(),
  },
  divider: {
    fontSize: 16,
    padding: "0px 8px",
    color: colors.GREY(1),
    "@media only screen and (max-width: 767px)": {
      padding: "0px 8px",
    },
  },
  threadline: {
    height: "100%",
    width: 2,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: colors.GREY_LINE(),
    // ":hover": {
    //   backgroundColor: colors.NEW_BLUE(1),
    // },
  },
  threadLineContainer: {
    padding: 8,
    paddingBottom: 0,
    height: "calc(100% - 84px)",
    cursor: "pointer",
    ":hover .threadline": {
      backgroundColor: colors.NEW_BLUE(1),
    },
  },
  hoverThreadline: {
    backgroundColor: colors.NEW_BLUE(),
  },
  activeThreadline: {
    backgroundColor: colors.NEW_BLUE(0.3),
  },
  left: {
    alignItems: "center",
    width: 48,
    display: "table-cell",
    height: "100%",
    verticalAlign: "top",
    "@media only screen and (max-width: 600px)": {
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
    // backgroundColor: "#FFF",
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
    marginBottom: 15,
  },
  content: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    overflowWrap: "break-word",
    lineHeight: 1.6,
  },
  acceptedAnswer: {
    border: `1px solid ${colors.NEW_GREEN()}`,
  },
  contentEdit: {
    border: `1px soild`,
    borderColor: "rgb(170, 170, 170)",
    background: "unset",
    padding: "0",
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
    padding: "9px 10px 8px 8px",
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
      color: colors.NEW_BLUE(),
    },
  },
  loadingText: {
    color: colors.NEW_BLUE(),
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
  overrideStar: {
    fontSize: 14,
    width: 18,
  },
  starInputStyleOverride: {
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    discussion: state.discussion,
    vote: state.vote,
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  dispatch: (dispatch) => {
    return dispatch;
  },
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
