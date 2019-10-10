import { Fragment } from "react";

import { css, StyleSheet } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";
import { Value } from "slate";
import Plain from "slate-plain-serializer";

import DiscussionCard from "~/components/DiscussionCard";
import { ReplyBox } from "~/components/DiscussionCommentBox";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import TextEditor from "~/components/TextEditor";
import VoteWidget from "~/components/VoteWidget";

import DiscussionActions from "~/redux/discussion";

import colors, { discussionPageColors } from "~/config/themes/colors";
import { createUsername, getNestedValue, doesNotExist } from "~/config/utils";
import { UPVOTE, DOWNVOTE } from "../config/constants";

class DiscussionComment extends React.Component {
  state = {
    id: this.props.data.id,
    date: this.props.data.createdDate,
    text: this.props.data.text,
    selectedVoteType: this.props.data.userVote.voteType,
    score: this.props.data.score,
    username: createUsername(this.props.data),
  };

  deserializeComment = (text) => {
    try {
      text = Value.fromJSON(JSON.parse(text));
    } catch (SyntaxError) {
      text = Plain.deserialize(text);
    }
    return text;
  };

  upvote = async () => {
    const { paperId, discussionThreadId } = Router.query;

    this.props.dispatch(DiscussionActions.postUpvotePending());
    await this.props.dispatch(
      DiscussionActions.postUpvote(paperId, discussionThreadId, this.state.id)
    );

    this.updateWidgetUI(this.props.voteResult);
  };

  downvote = async () => {
    const { paperId, discussionThreadId } = Router.query;

    this.props.dispatch(DiscussionActions.postDownvotePending());
    await this.props.dispatch(
      DiscussionActions.postDownvote(paperId, discussionThreadId, this.state.id)
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
    const text = this.deserializeComment(this.state.text);
    return <TextEditor readOnly={true} canEdit={false} initialValue={text} />;
  };

  render() {
    const action = this.renderAction ? this.renderAction() : null;
    const replies = this.renderReplies ? this.renderReplies() : null;

    return (
      <Fragment>
        <DiscussionCard
          top={this.renderTop()}
          info={this.renderInfo()}
          infoStyle={this.props.infoStyle}
          action={action}
        />
        {replies}
      </Fragment>
    );
  }
}

class CommentClass extends DiscussionComment {
  constructor(props) {
    super(props);
    this.state.showReplyBox = false;
    this.state.replies = this.props.data.replies;
  }

  renderAction = () => {
    return (
      <div className={css(styles.actionBar)}>
        {!this.state.showReplyBox
          ? this.renderReplyButton()
          : this.renderReplyBox()}
      </div>
    );
  };

  renderReplyButton = () => {
    return (
      <div className={css(styles.reply)} onClick={this.showReplyBox}>
        Reply
      </div>
    );
  };

  showReplyBox = () => {
    this.setState({ showReplyBox: true });
  };

  renderReplyBox = () => {
    return (
      <ReplyBox onSubmit={this.addSubmittedReply} commentId={this.state.id} />
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
    return this.state.replies.map((r, i) => {
      let divider = <div className={css(styles.divider)} />;
      if (i === 0) {
        divider = null;
      }
      return (
        <Fragment key={r.id}>
          {divider}
          <Reply key={r.id} data={r} />
        </Fragment>
      );
    });
  };
}

const mapStateToProps = (state) => {
  return {
    voteResult: state.discussion.voteResult,
  };
};

export const Comment = connect(
  mapStateToProps,
  null
)(CommentClass);

class ReplyClass extends DiscussionComment {
  constructor(props) {
    super(props);
  }
}

export const Reply = connect(
  mapStateToProps,
  null
)(ReplyClass);

const styles = StyleSheet.create({
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
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  allCommentsContainer: {
    width: "100%",
  },
  commentContainer: {
    padding: "30px 30px 36px 30px",
  },
  commentInfo: {
    color: colors.BLACK(0.8),
  },
  commentBoxContainer: {
    width: "100%",
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
});
