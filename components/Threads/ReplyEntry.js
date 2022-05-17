import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "../VoteWidget";
import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import ThreadTextEditor from "./ThreadTextEditor";

// Config
import colors from "~/config/themes/colors";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { getNestedValue } from "~/config/utils/misc";

// Redux
import DiscussionActions from "~/redux/discussion";
import { createUsername } from "~/config/utils/user";
import { MessageActions } from "~/redux/message";

class ReplyEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      highlight: false,
      score: 0,
      selectedVoteType: "",
      // Removed
      removed: false,
      // Edit
      canEdit: false,
      editing: false,
      // Response
      isResponse: false,
    };
    this.replyRef = null;
  }

  componentDidMount() {
    const selectedVoteType = getNestedValue(this.props, [
      "reply",
      "user_vote",
      "vote_type",
    ]);
    const score = this.props.reply.score;
    this.setState(
      {
        score,
        selectedVoteType,
        highlight: this.shouldHighlight(),
        removed: this.props.reply.is_removed,
        canEdit:
          this.props.auth &&
          this.props.auth.user.id === this.props.reply.created_by.id,
      },
      () => {
        this.props.reply.highlight &&
          setTimeout(() => {
            this.setState({ highlight: false }, () => {
              this.props.reply.highlight = false;
            });
          }, 10000);
      }
    );
  }

  shouldHighlight = () => {
    const { newCard, currentAuthor, reply } = this.props;
    const isCurrentAuthor =
      currentAuthor?.id === reply.created_by.author_profile.id;
    if (newCard || isCurrentAuthor) {
      return true;
    }
    return false;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.auth !== this.props.auth) {
      let { auth, reply } = this.props;
      this.setState({
        canEdit: auth.user.id === reply.created_by.id,
      });
    }
  }

  formatMetaData = () => {
    let { data, comment, reply, post, hypothesis, documentType } = this.props;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }
    return {
      authorId: data.created_by.author_profile.id,
      threadId: data.id,
      commentId: comment.id,
      paperId: data.paper,
      replyId: reply.id,
      userFlag: reply.userFlag,
      contentType: "reply",
      objectId: reply.id,
      documentId: documentId,
    };
  };

  handleStateRendering = () => {
    if (this.state.removed) {
      return false;
    }
    if (!this.state.collapsed) {
      return true;
    }
  };

  toggleCollapsed = (e) => {
    e && e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed });
  };

  toggleEdit = () => {
    this.setState({ editing: !this.state.editing });
  };

  removePostUI = () => {
    this.setState({ removed: true }, () => {
      //Todo: clean this part of code, temp use
      this.props.reply.isRemoved = true;
    });
  };

  upvote = async () => {
    const {
      data,
      comment,
      reply,
      postUpvote,
      postUpvotePending,
      post,
      hypothesis,
      documentType,
    } = this.props;
    const discussionThreadId = data.id;
    const paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }
    const commentId = comment.id;
    const replyId = reply.id;

    postUpvotePending();

    await postUpvote(
      documentType,
      paperId,
      documentId,
      discussionThreadId,
      commentId,
      replyId
    );

    this.updateWidgetUI();
  };

  downvote = async () => {
    const {
      data,
      comment,
      reply,
      postDownvote,
      postDownvotePending,
      post,
      hypothesis,
      documentType,
    } = this.props;
    const discussionThreadId = data.id;
    const paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }
    const commentId = comment.id;
    const replyId = reply.id;

    postDownvotePending();

    await postDownvote(
      documentType,
      paperId,
      documentId,
      discussionThreadId,
      commentId,
      replyId
    );

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

  submitReply = async (text, plain_text, callback) => {
    let {
      data,
      comment,
      postReply,
      postReplyPending,
      documentType,
      post,
      hypothesis,
    } = this.props;
    let paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }
    let discussionThreadId = data.id;
    let commentId = comment.id;

    postReplyPending();
    await postReply(
      documentType,
      paperId,
      documentId,
      discussionThreadId,
      commentId,
      text,
      plain_text
    );
    if (this.props.discussion.donePosting && this.props.discussion.success) {
      callback && callback();
      this.props.onReplySubmitCallback();
    } else {
      callback && callback();
    }
  };

  saveEditsReply = async (text, plain_text, callback) => {
    let {
      data,
      comment,
      reply,
      updateReply,
      updateReplyPending,
      showMessage,
      setMessage,
      post,
      hypothesis,
      documentType,
    } = this.props;
    let paperId = data.paper;
    let documentId;
    if (documentType === "post") {
      documentId = post.id;
    } else if (documentType === "hypothesis") {
      documentId = hypothesis.id;
    }
    let discussionThreadId = data.id;
    let commentId = comment.id;
    let replyId = reply.id;

    updateReplyPending();
    await updateReply(
      documentType,
      paperId,
      documentId,
      discussionThreadId,
      commentId,
      replyId,
      text,
      plain_text
    );
    if (this.props.discussion.doneUpdating && this.props.discussion.success) {
      setMessage("Comment successfully updated!");
      showMessage({ show: true });
      callback();
      this.setState({ editing: false });
    } else {
      setMessage("Something went wrong");
      showMessage({ show: true, error: true });
    }
  };

  formatBody = () => {
    return this.props.reply.text;
  };

  checkForExistingQuote = (delta) => {
    let quoteBlock = delta.ops[1];
    return (
      quoteBlock &&
      quoteBlock.insert === "\n" &&
      quoteBlock.attributes &&
      quoteBlock.attributes.blockquote
    );
  };

  createQuoteText = (parentDelta) => {
    let quoteText = "",
      maxLength = 255;

    for (var i = 0; i < parentDelta.ops.length; i++) {
      if (typeof parentDelta.ops[i].insert === "string") {
        quoteText += parentDelta.ops[i].insert;
      }
    }

    let trimmedText = quoteText.replace(/\n/g, " ");

    if (maxLength < trimmedText.length) {
      trimmedText = trimmedText.substr(0, maxLength + 1);
      trimmedText =
        trimmedText.substr(
          0,
          Math.min(trimmedText.length, trimmedText.lastIndexOf(" "))
        ) + "...";
    }

    return trimmedText;
  };

  formatQuoteBlock = () => {
    let delta = JSON.parse(JSON.stringify(this.props.reply.text));
    if (delta.ops) {
      if (this.checkForExistingQuote(delta)) {
        delta.ops = delta.ops.slice(2); // remove existing quote (for extra nested replies)
      }

      delta.ops = [
        {
          insert: this.createQuoteText(delta),
        },
      ];

      delta.ops.push({
        insert: "\n",
        attributes: {
          blockquote: true,
        },
      });
      delta.ops.push({
        insert: "\n",
      });
    }

    return delta;
  };

  render() {
    const {
      hostname,
      noVote,
      mobileView,
      reply,
      paper,
      mediaOnly,
      documentType,
    } = this.props;
    let dataCount = 0; // set to 0 for now; replies can't be replied to
    let date = reply.created_date;
    let body = this.formatBody();
    let username = createUsername(reply);
    let metaIds = this.formatMetaData();
    return (
      <div
        className={css(styles.row, styles.replyCard)}
        ref={(element) => (this.replyRef = element)}
      >
        <div
          className={css(
            styles.column,
            styles.left,
            noVote && styles.columnNoVote
          )}
        >
          <div
            className={css(
              styles.voteContainer,
              this.state.highlight && styles.voteContainerHighlight
            )}
          >
            {noVote ? null : (
              <VoteWidget
                styles={styles.voteWidget}
                score={this.state.score}
                onUpvote={this.upvote}
                onDownvote={this.downvote}
                selected={this.state.selectedVoteType}
                fontSize={"12px"}
                width={"40px"}
                type={"Reply"}
                promoted={false}
              />
            )}
            {this.handleStateRendering() && (
              <div
                className={css(
                  styles.threadline,
                  noVote && styles.threadlineNoVote
                )}
              ></div>
            )}
          </div>
        </div>
        <div className={css(styles.column, styles.metaData)}>
          <div
            className={css(
              styles.mainContent,
              this.state.highlight && styles.highlight,
              this.state.removed && styles.noPadding
            )}
          >
            {!this.state.removed && (
              <div className={css(styles.row, styles.topbar)}>
                <DiscussionPostMetadata
                  authorProfile={getNestedValue(reply, [
                    "created_by",
                    "author_profile",
                  ])}
                  isCreatedByEditor={reply?.is_created_by_editor}
                  username={username}
                  date={date}
                  paper={paper}
                  documentType={documentType}
                  smaller={true}
                  onHideClick={!mobileView && this.toggleCollapsed}
                  hideState={this.state.collapsed}
                  dropDownEnabled={true}
                  // Moderator
                  metaData={metaIds}
                  onRemove={this.removePostUI}
                  data={reply}
                />
              </div>
            )}
            {this.handleStateRendering() ? (
              <Fragment>
                <div className={css(styles.content)}>
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    body={true}
                    editing={this.state.editing}
                    onEditCancel={this.toggleEdit}
                    onEditSubmit={this.saveEditsReply}
                    textStyles={styles.commentEditor}
                    mediaOnly={mediaOnly}
                  />
                </div>
                <div className={css(styles.row, styles.bottom)}>
                  <ThreadActionBar
                    comment={true}
                    contentID={reply?.id}
                    contentType="reply"
                    count={dataCount}
                    documentType={this.props.documentType}
                    editing={this.state.editing}
                    hasHeader={true}
                    hideCount={true}
                    hostname={hostname}
                    initialValue={this.formatQuoteBlock()}
                    isRemoved={this.state.removed}
                    mediaOnly={mediaOnly}
                    onSubmit={this.submitReply}
                    small={true}
                    toggleEdit={this.state.canEdit && this.toggleEdit}
                  />
                </div>
              </Fragment>
            ) : (
              <div className={css(styles.content)}>
                {this.state.removed && (
                  <div className={css(styles.removedText)}>
                    Comment Removed By Moderator
                  </div>
                )}
              </div>
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
    height: "100%",
  },
  columnNoVote: {
    width: 18,
  },
  threadlineNoVote: {
    height: "100%",
  },
  left: {
    alignItems: "center",
    width: 40,
    display: "table-cell",
    height: "100%",
    verticalAlign: "top",
  },
  voteContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  replyCard: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 5,
    overflow: "visible",
    display: "table",
    tableLayout: "fixed",
    height: "1%",
    borderSpacing: 0,
    "@media only screen and (max-width: 415px)": {
      justifyContent: "space-between",
    },
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
    "@media only screen and (max-width: 415px)": {
      marginTop: 10,
      marginBottom: 10,
    },
  },
  metaData: {
    boxSizing: "border-box",
    width: "100%",
    marginLeft: 5,
    display: "table-cell",
    height: "100%",
  },
  voteContainerHighlight: {
    marginTop: 5,
  },
  mainContent: {
    width: "100%",
    padding: "2px 10px 8px 8px",
    boxSizing: "border-box",
    marginLeft: 2,
  },
  highlight: {
    padding: "8px 10px 10px 15px",
    backgroundColor: colors.LIGHT_BLUE(0.2),
    borderRadius: 5,
    marginBottom: 5,
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 10,
      paddingRight: 5,
      paddingBottom: 5,
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
    fontSize: 20,
  },
  body: {
    margin: 0,
  },
  voteWidget: {
    margin: 0,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
  },
  removedText: {
    fontStyle: "italic",
    fontSize: 13,
  },
  noPadding: {
    paddingBottom: 0,
  },
  commentEditor: {
    fontSize: 16,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  threadline: {
    height: "calc(100% - 53px)",
    width: 2,
    backgroundColor: "#EEEFF1",
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.BLUE(1),
    },
  },
});

const mapStateToProps = (state) => ({
  discussion: state.discussion,
  vote: state.vote,
  auth: state.auth,
});

const mapDispatchToProps = {
  postReply: DiscussionActions.postReply,
  postReplyPending: DiscussionActions.postReplyPending,
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
  updateReply: DiscussionActions.updateReply,
  updateReplyPending: DiscussionActions.updateReplyPending,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplyEntry);
