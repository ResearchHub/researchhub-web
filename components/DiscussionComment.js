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

import DiscussionActions from "~/redux/discussion";

import { UPVOTE, DOWNVOTE } from "../config/constants";
import { discussionPageColors } from "~/config/themes/colors";
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
    const vote = getNestedValue(voteResult, ["vote"], false);
    if (vote) {
      const voteType = vote.voteType;
      if (voteType === UPVOTE) {
        this.setState({ selectedVoteType: UPVOTE });
      } else if (voteType === DOWNVOTE) {
        this.setState({ selectedVoteType: DOWNVOTE });
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
        <VoteWidget
          score={this.state.score}
          onUpvote={this.upvote}
          onDownvote={this.downvote}
          selected={this.state.selectedVoteType}
        />
        <DiscussionPostMetadata
          username={this.state.username}
          date={this.state.date}
        />
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
          infoStyle={this.props.infoStyle}
          action={action}
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
  }

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
          onSubmit={this.addSubmittedReply}
          commentId={this.state.id}
        />
        {this.createdByCurrentUser() && (
          <EditAction onClick={this.setReadOnly} />
        )}
        {this.renderReplies()}
      </div>
    );
  };

  addSubmittedReply = (reply) => {
    if (!doesNotExist(reply)) {
      let newReplies = [reply];
      newReplies = newReplies.concat(this.state.replies);
      this.setState({ replies: newReplies });
    }
  };

  renderReplies = () => {
    const replies = this.state.replies.map((r, i) => {
      return <Reply key={r.id} data={r} commentId={this.state.id} />;
    });

    return (
      <Fragment>
        <div>{this.state.replyCount} Replies</div>
        {replies}
      </Fragment>
    );
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
          <EditAction onClick={this.setReadOnly} />
        </div>
      );
    }
  };
}

const mapStateToProps = (state) => {
  return {
    voteResult: state.discussion.voteResult,
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
  commentContainer: {
    paddingTop: "32px",
  },
  commentEditor: {
    minHeight: "100%",
    padding: "0px",
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
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
});
