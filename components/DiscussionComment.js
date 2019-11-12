import { Fragment } from "react";

import { css, StyleSheet } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";

import DiscussionCard from "~/components/DiscussionCard";
import { ReplyEditor } from "~/components/DiscussionCommentEditor";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import EditAction from "~/components/EditAction";
import TextEditor from "~/components/TextEditor";
import VoteWidget from "~/components/VoteWidget";
import Loader from "~/components/Loader/Loader";

import DiscussionActions from "~/redux/discussion";
import { MessageActions } from "~/redux/message";

import { UPVOTE, DOWNVOTE } from "../config/constants";
import { voteWidgetIcons } from "~/config/themes/icons";
import colors, { discussionPageColors } from "~/config/themes/colors";
import {
  createUsername,
  doesNotExist,
  getCurrentUser,
  getNestedValue,
} from "~/config/utils";

class DiscussionComment extends React.Component {
  state = {
    id: this.props.data.id,
    date: this.props.data.createdDate,
    text: this.props.data.text,
    selectedVoteType: this.props.data.userVote.voteType,
    score: this.props.data.score,
    createdBy: this.props.data.createdBy,
    username: createUsername(this.props.data),
    readOnly: true,
    paperId: Router.query.paperId,
    discussionThreadId: Router.query.discussionThreadId,
  };

  componentDidUpdate(prevProps, prevState) {
    const selectedVoteType = getNestedValue(this.props, [
      "data",
      "userVote",
      "voteType",
    ]);
    if (selectedVoteType !== prevState.selectedVoteType) {
      this.setState({ selectedVoteType });
      // Force reset the replies so that they re-render
      this.setState({ replies: this.props.data.replies });
    }
  }

  createdByCurrentUser = () => {
    return this.state.createdBy.id === this.props.currentUser.id;
  };

  setReadOnly = (readOnly) => {
    this.setState({ readOnly });
  };

  upvote = async () => {
    const { paperId, discussionThreadId } = this.state;

    this.props.dispatch(DiscussionActions.postUpvotePending());

    const ids = [];
    if (this.props.commentId) {
      ids.push(this.props.commentId);
    }
    ids.push(this.state.id);

    await this.props.dispatch(
      DiscussionActions.postUpvote(paperId, discussionThreadId, ...ids)
    );

    this.updateWidgetUI(this.props.voteResult);
  };

  downvote = async () => {
    const { paperId, discussionThreadId } = this.state;

    this.props.dispatch(DiscussionActions.postDownvotePending());

    const ids = [];
    if (this.props.commentId) {
      ids.push(this.props.commentId);
    }
    ids.push(this.state.id);

    await this.props.dispatch(
      DiscussionActions.postDownvote(paperId, discussionThreadId, ...ids)
    );

    this.updateWidgetUI(this.props.voteResult);
  };

  updateWidgetUI = (voteResult) => {
    const success = voteResult.success;
    const vote = getNestedValue(voteResult, ["vote"], false);
    if (success) {
      const voteType = vote.voteType;
      if (voteType === UPVOTE) {
        this.setState({
          selectedVoteType: UPVOTE,
          score: this.state.score + 1,
        });
      } else if (voteType === DOWNVOTE) {
        this.setState({
          selectedVoteType: DOWNVOTE,
          score: this.state.score - 1,
        });
      }
    }
  };

  updateEditor = (updatedContent) => {
    if (updatedContent) {
      this.setState({ text: updatedContent.text }, () => {
        this.setReadOnly(true);
      });
    }
    return false;
  };

  renderTop = () => {
    return (
      <Fragment>
        <div className={css(styles.topbarContainer)}>
          <div className={css(styles.votingWidget)}>
            <VoteWidget
              score={this.state.score}
              onUpvote={this.upvote}
              onDownvote={this.downvote}
              selected={this.state.selectedVoteType}
            />
          </div>
          <span className={css(styles.mobileVotingWidget)}>
            <VoteWidget
              score={this.state.score}
              onUpvote={this.upvote}
              onDownvote={this.downvote}
              horizontalView={true}
              selected={this.state.selectedVoteType}
            />
          </span>
          <DiscussionPostMetadata
            username={this.state.username}
            authorProfile={this.props.data.createdBy.authorProfile}
            date={this.state.date}
          />
        </div>
      </Fragment>
    );
  };

  renderInfo = () => {
    return (
      <TextEditor
        classNames={[styles.commentEditor]}
        readOnly={this.state.readOnly}
        onSubmit={this.updateText}
        initialValue={this.state.text}
        commentStyles={this.props.commentStyles && this.props.commentStyles}
      />
    );
  };

  render() {
    const action = this.renderAction ? this.renderAction() : null;

    return (
      <div className={css(styles.commentContainer)}>
        <DiscussionCard
          top={this.renderTop()}
          info={this.renderInfo()}
          infoStyle={[this.props.infoStyle, styles.mobileInfoContainer]}
          action={action}
          containerStyle={
            this.props.discussionCardStyle
              ? this.props.discussionCardStyle
              : this.props.replyCardStyle && this.props.replyCardStyle
          }
        />
      </div>
    );
  }
}

class CommentClass extends DiscussionComment {
  constructor(props) {
    super(props);
    this.state.showReplyBox = false;
    this.state.replies = this.props.data.replies;
    this.state.replyCount = this.props.data.replyCount;
    this.state.toggleReplies = false;
    this.state.transition = false;
    this.state.loaded = false;
    this.state.windowPostion = null;
    this.state.highlight = false;
    this.ref = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleWindowScroll);
  }

  componentDidUpdate(prevProp) {
    if (prevProp !== this.props) {
      this.handleWindowScroll();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleWindowScroll);
  }

  handleWindowScroll = () => {
    this.setState({ windowPostion: window.pageYOffset });
  };

  updateText = async (text) => {
    this.props.dispatch(DiscussionActions.updateCommentPending());
    await this.props.dispatch(
      DiscussionActions.updateComment(
        this.state.paperId,
        this.state.discussionThreadId,
        this.state.id,
        text
      )
    );
    return this.updateEditor(this.props.updatedComment);
  };

  renderAction = () => {
    return (
      <div className={css(styles.actionBar)}>
        <ReplyEditor
          onCancel={() => this.setState({ showReplyBox: false })}
          onSubmit={this.addSubmittedReply}
          commentId={this.state.id}
          commentStyles={styles.overrideReplyStyle}
        />
        {/* {this.createdByCurrentUser() && (
          <EditAction onClick={this.setReadOnly} />
        )} */}
        {this.renderReplies()}
      </div>
    );
  };

  addSubmittedReply = (reply) => {
    // if (!doesNotExist(reply)) {
    this.props.dispatch(MessageActions.showMessage({ show: true, load: true }));
    this.setState({ highlight: true }, () => {
      this.props.dispatch(MessageActions.showMessage({ show: false }));
      let newReplies = [reply];
      newReplies = newReplies.concat(this.state.replies);
      this.setState({
        replies: newReplies,
        replyCount: newReplies.length,
        toggleReplies: true,
      });
      setTimeout(() => {
        setTimeout(() => {
          this.setState({ highlight: false });
        }, 2000);
      }, 400);
    });
    // }
  };

  toggleReplies = () => {
    this.setState(
      {
        toggleReplies: !this.state.toggleReplies,
        transition: !this.state.loaded,
      },
      () => {
        setTimeout(() => {
          this.setState({ transition: false, loaded: true }, () => {
            window.scrollTo(0, this.state.windowPostion);
          });
        }, 400);
      }
    );
  };

  renderMessage = () => {
    if (this.state.toggleReplies) {
      return `Hide ${this.state.replyCount.length === 1 ? "reply" : "replies"}`;
    } else {
      return `View ${
        this.state.replyCount === 1
          ? `${this.state.replyCount} reply`
          : `${this.state.replyCount} replies`
      }`;
    }
  };

  renderReplies = () => {
    const replies =
      this.state.replies &&
      this.state.replies.map((r, i) => {
        return (
          <Reply
            key={r.id}
            data={r}
            commentId={this.state.id}
            replyCardStyle={
              this.state.highlight && i === 0
                ? styles.highlight
                : styles.replyCardContainer
            }
            commentStyles={styles.replyInputContainer}
          />
        );
      });

    if (replies.length > 0) {
      return (
        <Fragment>
          <div className={css(styles.showReplyContainer)}>
            <div className={css(styles.showReply)} onClick={this.toggleReplies}>
              <span className={css(styles.icon)}>
                {this.state.toggleReplies
                  ? voteWidgetIcons.upvote
                  : voteWidgetIcons.downvote}
              </span>
              {this.renderMessage()}
            </div>
          </div>
          <div
            className={css(
              styles.replyContainer,
              this.state.toggleReplies && styles.show
            )}
          >
            {this.state.transition ? <Loader /> : replies}
          </div>
        </Fragment>
      );
    }
  };
}

class ReplyClass extends DiscussionComment {
  constructor(props) {
    super(props);
  }

  updateText = async (text) => {
    this.props.dispatch(DiscussionActions.updateReplyPending());
    await this.props.dispatch(
      DiscussionActions.updateReply(
        this.state.paperId,
        this.state.discussionThreadId,
        this.props.commentId,
        this.state.id,
        text
      )
    );

    return this.updateEditor(this.props.updatedReply);
  };

  renderAction = () => {
    if (this.createdByCurrentUser()) {
      return (
        <div className={css(styles.actionBar)}>
          {/* <EditAction onClick={this.setReadOnly} /> */}
        </div>
      );
    }
  };
}

const mapStateToProps = (state) => {
  return {
    voteResult: state.vote,
    currentUser: getCurrentUser(state),
    updatedComment: state.discussion.updatedComment,
    updatedReply: state.discussion.updatedReply,
  };
};

export const Comment = connect(
  mapStateToProps,
  null
)(CommentClass);

export const Reply = connect(
  mapStateToProps,
  null
)(ReplyClass);

const styles = StyleSheet.create({
  commentContainer: {},
  highlight: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 30,
    paddingRight: 30,
    lineHeight: 1.6,
    "@media only screen and (max-width: 415px)": {
      borderRadius: 0,
      borderLeft: `1px solid ${discussionPageColors.DIVIDER}`,
      paddingLeft: 15,
      paddingRight: 15,
    },
    backgroundColor: colors.LIGHT_YELLOW(1),
  },
  replyCardContainer: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 30,
    paddingRight: 30,
    lineHeight: 1.6,
    "@media only screen and (max-width: 415px)": {
      borderRadius: 0,
      borderLeft: `1px solid ${discussionPageColors.DIVIDER}`,
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  replyInputContainer: {
    padding: 0,
    lineHeight: 1.6,
  },
  overrideDiscussionCardContainerStyle: {
    margin: 0,
    backgroundColor: "lightyellow",
  },
  commentEditor: {
    minHeight: "100%",
    padding: "0px",
    lineHeight: 1.6,
  },
  voteWidget: {
    marginRight: 18,
  },
  actionBar: {
    marginTop: 8,
    width: "100%",
  },
  reply: {
    cursor: "pointer",
    userSelect: "none",
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
  showReplyContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  replyContainer: {
    transition: "all ease-in-out 0.2s",
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  overrideReplyStyle: {
    borderLeft: "1px solid",
    borderColor: discussionPageColors.DIVIDER,
  },
  show: {
    height: "calc(100%)",
    opacity: 1,
  },
  showReply: {
    cursor: "pointer",
    userSelect: "none",
    color: colors.BLUE(1),
    fontSize: 15,
  },
  icon: {
    marginRight: 10,
  },
  votingWidget: {
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  mobileVotingWidget: {
    display: "none",
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      marginBottom: 15,
    },
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 10,
    },
  },
  topbarContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media only screen and (max-width: 760px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 15,
    },
    "@media only screen and (max-width: 415px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 14,
    },
  },
  mobileInfoContainer: {
    "@media only screen and (max-width: 760px)": {
      paddingLeft: 0,
    },
  },
});
