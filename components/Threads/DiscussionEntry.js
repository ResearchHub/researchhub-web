import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "../VoteWidget";
import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import { Title } from "../DiscussionThreadCard";
import CommentEntry from "./CommentEntry";
import { ClientLinkWrapper } from "../LinkWrapper";
import ThreadLine from "./ThreadLine";
import ThreadTextEditor from "./ThreadTextEditor";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { getNestedValue } from "~/config/utils";

// Redux
import DiscussionActions from "../../redux/discussion";
import { MessageActions } from "~/redux/message";
import { comment } from "../../redux/discussion/shims";
import { transformComments } from "~/redux/discussion/shims";

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
    };
    this.divRef = null;
  }

  componentDidMount = async () => {
    const {
      paper,
      index,
      fetchComments,
      discussion,
      data,
      newCard,
    } = this.props;
    const comments = data.comments ? data.comments : [];
    const selectedVoteType = getNestedValue(this.props, [
      "data",
      "userVote",
      "voteType",
    ]);
    this.setState(
      {
        comments,
        score: data.score,
        selectedVoteType,
        revealComment: comments.length > 0 && comments.length < 6,
        highlight: newCard,
        removed: this.props.data.isRemoved,
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

  componentDidUpdate = async (prevProps) => {};

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

  createUsername = ({ createdBy }) => {
    if (createdBy) {
      const { firstName, lastName } = createdBy;
      return `${firstName} ${lastName}`;
    }
    return null;
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
    let { data, postComment, postCommentPending } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    postCommentPending();
    await postComment(paperId, discussionThreadId, text, plain_text);
    if (this.props.discussion.donePosting && this.props.discussion.success) {
      let newComment = { ...this.props.discussion.postedComment };
      newComment.highlight = true;
      let comments = [newComment, ...this.state.comments];
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

  removePostUI = () => {
    this.setState({ removed: true }, () => {
      this.calculateThreadHeight();
    });
  };

  renderComments = () => {
    let { data, hostname, path, discussion } = this.props;
    let comments = this.state.comments;

    if (comment.length) {
      return comments.map((comment, i) => {
        return (
          <CommentEntry
            data={data}
            hostname={hostname}
            path={path}
            key={`disc${comment.id}-${i}`}
            calculateThreadHeight={this.calculateThreadHeight}
            comment={comment}
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
    const { data, hostname, hoverEvents, path, mobileView, index } = this.props;
    let commentCount =
      this.state.comments.length > data.commentCount
        ? this.state.comments.length
        : data.commentCount;
    let date = data.createdDate;
    let title = data.title;
    let body = data.text;
    let username = this.createUsername(data);
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
            type={"discussion"}
            fontSize={"16px"}
            width={"44px"}
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
                    authorProfile={data && data.createdBy.authorProfile}
                    username={username}
                    date={date}
                    threadPath={path}
                    dropDownEnabled={true}
                    // Moderator
                    metaData={metaData}
                    onRemove={this.removePostUI}
                  />
                </div>
                <div className={css(styles.content)}>
                  {/* <Title text={title} overrideStyle={styles.title} /> */}
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    body={true}
                    textStyles={styles.contentText}
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
                hostname={hostname}
                threadPath={path}
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
    // marginBottom: 15,
    overflow: "visible",
    borderRadius: 3,
    position: "relative",
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    padding: 10,
    paddingRight: 0,
    cursor: "default",
    // borderBottom: "1px solid #E8E8F2",
    // ":hover": {
    //   borderColor: "rgb(179, 179, 179)",
    // },
  },
  topbar: {
    width: "100%",
    margin: "20px 0px 5px 0",
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
  contentText: {
    fontSize: 16,
    padding: 0,
  },
  metaData: {
    width: "calc(100% - 48px)",
    paddingTop: 2,
    boxSizing: "border-box",
  },
  highlight: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 5,
    padding: "0px 10px 10px 15px",
    ":hover": {
      backgroundColor: "#FAFAFA",
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
});

const mapDispatchToProps = {
  postComment: DiscussionActions.postComment,
  postCommentPending: DiscussionActions.postCommentPending,
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionEntry);
