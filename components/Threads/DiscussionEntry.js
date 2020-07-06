import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "../VoteWidget";
import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import CommentEntry from "./CommentEntry";
import ThreadLine from "./ThreadLine";
import ThreadTextEditor from "./ThreadTextEditor";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { checkVoteTypeChanged, getNestedValue } from "~/config/utils";

// Redux
import DiscussionActions from "../../redux/discussion";
import { MessageActions } from "~/redux/message";
import { transformComments } from "~/redux/paper/shims";
import { createUsername } from "../../config/utils";

const DYNAMIC_HREF = "/paper/[paperId]/[tabName]/[discussionThreadId]";

class DiscussionEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elementHeight: 0,
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
    };
    this.divRef = null;
  }

  componentDidMount = async () => {
    const { data, newCard } = this.props;
    const comments = data.comments ? data.comments : [];
    const selectedVoteType = getNestedValue(data, ["userVote", "voteType"]);
    this.setState(
      {
        comments,
        score: data.score,
        selectedVoteType,
        revealComment: comments.length > 0 && comments.length < 6,
        highlight: newCard,
        removed: this.props.data.isRemoved,
        canEdit:
          data.source !== "twitter"
            ? this.props.auth.user.id === data.createdBy.id
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

  componentDidUpdate = async (prevProps, prevState) => {
    this.handleVoteTypeUpdate(prevProps);
    if (prevProps.auth !== this.props.auth) {
      let { data } = this.props;
      this.setState({
        canEdit:
          data.source !== "twitter"
            ? this.props.auth.user.id === data.createdBy.id
            : false,
      });
    }
    this.calculateThreadHeight();
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
        let { data } = this.props;
        let discussionThreadId = data.id;
        let paperId = data.paper;
        let page = this.state.page;

        fetch(
          API.THREAD_COMMENT(paperId, discussionThreadId, page),
          API.GET_CONFIG()
        )
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.setState({
              comments: [
                ...this.state.comments,
                ...transformComments(res.results),
              ],
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

  calculateThreadHeight = (height) => {
    if (this.divRef) {
      if (height) {
        return this.setState({
          elementHeight: height,
        });
      }
      if (this.divRef.clientHeight !== this.state.elementHeight) {
        this.setState({
          elementHeight: this.divRef.clientHeight,
        });
      }
    }
  };

  submitComment = async (text, plain_text, callback) => {
    let {
      data,
      postComment,
      postCommentPending,
      discussionCount,
      setCount,
    } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    postCommentPending();
    await postComment(paperId, discussionThreadId, text, plain_text);
    if (this.props.discussion.donePosting && this.props.discussion.success) {
      let newComment = { ...this.props.discussion.postedComment };
      newComment.highlight = true;
      let comments = [newComment, ...this.state.comments];
      data.comments = comments;
      setCount(discussionCount + 1);
      this.setState(
        {
          comments,
          revealComment: true,
        },
        () => {
          callback && callback();
        }
      );
    }
  };

  saveEditsThread = async (text, plain_text, callback) => {
    let {
      data,
      updateThread,
      updateThreadPending,
      showMessage,
      setMessage,
    } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;

    let body = {
      text,
      plain_text,
      paper: paperId,
    };
    updateThreadPending();
    await updateThread(paperId, discussionThreadId, body);
    if (this.props.discussion.doneUpdating && this.props.discussion.success) {
      setMessage("Post successfully updated!");
      showMessage({ show: true });
      callback();
      this.setState({ editing: false }, () => {
        this.calculateThreadHeight();
      });
    } else {
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    }
  };

  formatComment = (comment) => {
    let newComment = {};
    newComment.id = comment.id;
    newComment.text = { ...comment.text };
    newComment.thread = comment.thread;
    newComment.created_by = { ...comment.createdBy };
    newComment.created_date = comment.createdDate;
    newComment.score = comment.score;
    newComment.user_vote = comment.userVote;
    newComment.replies = [...comment.replies];
    newComment.reply_count = comment.replyCount;
    return newComment;
  };

  toggleCommentView = (e) => {
    e && e.stopPropagation();
    this.setState(
      {
        revealComment: !this.state.revealComment,
      },
      () => {
        this.calculateThreadHeight();
      }
    );
  };

  toggleHover = (e) => {
    e && e.stopPropagation();
    this.setState({ hovered: !this.state.hovered });
  };

  toggleEdit = () => {
    this.setState({ editing: !this.state.editing }, () => {
      this.calculateThreadHeight();
    });
  };

  removePostUI = () => {
    this.setState({ removed: true }, () => {
      this.calculateThreadHeight();
    });
  };

  renderComments = () => {
    let {
      data,
      hostname,
      path,
      discussion,
      discussionCount,
      setCount,
    } = this.props;
    let comments = this.state.comments;

    if (comments.length > 0) {
      return comments.map((comment, i) => {
        return (
          <CommentEntry
            data={data}
            hostname={hostname}
            path={path}
            key={`disc${comment.id}-${i}`}
            calculateThreadHeight={this.calculateThreadHeight}
            comment={comment}
            index={i}
            mobileView={this.props.mobileView}
            discussionCount={discussionCount}
            setCount={setCount}
          />
        );
      });
    }
  };

  renderViewMore = () => {
    if (this.state.comments.length < this.props.data.commentCount) {
      let fetching = this.state.fetching;
      let totalCount = this.props.data.commentCount;
      let currentCount = this.state.comments.length;
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
    let { data, postUpvote, postUpvotePending } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;

    postUpvotePending();

    await postUpvote(paperId, discussionThreadId);

    this.updateWidgetUI(this.props.voteResult);
  };

  downvote = async () => {
    let { data, postDownvote, postDownvotePending } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;

    postDownvotePending();

    await postDownvote(paperId, discussionThreadId);

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
    const { data, hostname, path, mobileView } = this.props;
    let commentCount =
      this.state.comments.length > data.commentCount
        ? this.state.comments.length
        : data.commentCount;
    let date = data.createdDate;
    let title = data.title;
    let body = data.source === "twitter" ? data.plainText : data.text;
    let username = data.createdBy ? createUsername(data) : "";
    let metaData = {
      threadId: data.id,
      paperId: data.paper,
      userFlag: data.userFlag,
    };

    return (
      <div
        className={css(
          styles.row,
          styles.discussionCard,
          this.state.highlight && styles.highlight
        )}
      >
        <div className={css(styles.column, styles.left)}>
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
          <ThreadLine
            parent={this.divRef}
            offset={80}
            parentHeight={this.state.elementHeight}
            onClick={this.toggleCommentView}
            hovered={this.state.hovered}
            active={this.state.revealComment}
          />
        </div>
        <div
          className={css(styles.column, styles.metaData)}
          ref={(element) => (this.divRef = element)}
        >
          <span
            className={css(
              styles.highlight,
              this.state.highlight && styles.active
            )}
          >
            {!this.state.removed ? (
              <Fragment>
                <div className={css(styles.row, styles.topbar)}>
                  <DiscussionPostMetadata
                    authorProfile={
                      data &&
                      getNestedValue(data, ["createdBy", "authorProfile"], null)
                    }
                    username={username}
                    date={date}
                    threadPath={path}
                    hostname={hostname}
                    dropDownEnabled={true}
                    // Moderator
                    metaData={metaData}
                    onRemove={this.removePostUI}
                    // Twitter
                    twitter={data.source === "twitter"}
                    twitterUrl={data.url}
                  />
                </div>
                <div
                  className={css(
                    styles.content,
                    this.state.editing && styles.contentEdit
                  )}
                >
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    body={true}
                    textStyles={styles.contentText}
                    editing={this.state.editing}
                    onEditCancel={this.toggleEdit}
                    onEditSubmit={this.saveEditsThread}
                    onChange={this.calculateThreadHeight}
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
            <div className={css(styles.row, styles.bottom)}>
              <ThreadActionBar
                editing={this.state.editing}
                toggleEdit={this.state.canEdit && this.toggleEdit}
                title={title}
                count={commentCount}
                threadHeight={this.state.elementHeight}
                calculateThreadHeight={this.calculateThreadHeight}
                showChildrenState={this.state.revealComment}
                onSubmit={this.submitComment}
                onClick={this.toggleCommentView}
                onCountHover={this.toggleHover}
                small={mobileView}
                isRemoved={this.state.removed}
                hideReply={data.source === "twitter"}
              />
            </div>
          </span>
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
    height: "calc(100%)",
  },
  left: {
    alignItems: "center",
    width: 48,
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
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
    borderRadius: 3,
    position: "relative",
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    paddingRight: 0,
    cursor: "default",
    justifyContent: "space-between",
  },
  topbar: {
    width: "100%",
    margin: "20px 0px 5px 0",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      marginTop: 18,
    },
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
    paddingTop: 2,
    boxSizing: "border-box",
    "@media only screen and (max-width: 415px)": {
      width: "calc(100% - 35px)",
    },
  },
  highlight: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 5,
    padding: "0px 10px 10px 15px",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 5,
    },
    "@media only screen and (max-width: 415px)": {
      paddingRight: 0,
    },
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
  active: {
    backgroundColor: colors.LIGHT_YELLOW(),
    ":hover": {
      backgroundColor: colors.LIGHT_YELLOW(),
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
    fontSize: 18,
    color: "rgb(35, 32, 56)",
    fontStyle: "italic",
  },
});

const mapStateToProps = (state) => ({
  discussion: state.discussion,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionEntry);
