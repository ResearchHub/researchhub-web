import { Fragment, useEffect, useState } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";
import { Value } from "slate";
import Plain from "slate-plain-serializer";

// components
import DiscussionCard from "~/components/DiscussionCard";
import { CommentBox, ReplyBox } from "~/components/DiscussionCommentBox";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import TextEditor from "~/components/TextEditor";
import VoteWidget from "~/components/VoteWidget";

// Redux
import DiscussionActions from "~/redux/discussion";

// Utils
import colors, { discussionPageColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { doesNotExist, isEmpty } from "~/config/utils";

const DiscussionThreadPage = (props) => {
  const { discussion } = props;

  const [comments, setComments] = useState([]);

  let title = "";
  let body = "";
  let username = "";
  let createdDate = "";

  if (discussion.success) {
    title = discussion.title;
    body = discussion.text;
    createdDate = discussion.createdDate;
    username = createUsername(discussion);
  }

  useEffect(() => {
    if (discussion.success) {
      const currentComments = discussion.commentPage.comments;
      setComments(currentComments);
    }
  }, [discussion.success]);

  function renderComments(comments) {
    return comments.map((c, i) => {
      let divider = <div className={css(styles.divider)} />;
      if (i === 0) {
        divider = null;
      }
      return (
        <Fragment key={c.id}>
          {divider}
          <Comment key={c.id} data={c} />
        </Fragment>
      );
    });
  }

  function addSubmittedComment(comment) {
    let newComments = [comment];
    newComments = newComments.concat(comments);
    setComments(newComments);
  }

  return (
    <div>
      <div className={css(styles.threadContainer)}>
        <Thread
          title={title}
          body={body}
          username={username}
          date={createdDate}
        />
      </div>
      <div className={css(styles.divider)} />
      <div className={css(styles.contentContainer)}>
        <CommentBox onSubmit={addSubmittedComment} />
        <div
          id="all_comments_container"
          className={css(styles.allCommentsContainer)}
        >
          {renderComments(comments)}
        </div>
      </div>
    </div>
  );
};

DiscussionThreadPage.getInitialProps = async ({ isServer, store, query }) => {
  let { discussion } = store.getState();

  if (isEmpty(discussion)) {
    const { paperId, discussionThreadId } = query;
    const page = 1;

    store.dispatch(DiscussionActions.fetchThreadPending());
    store.dispatch(DiscussionActions.fetchCommentsPending());
    await store.dispatch(
      DiscussionActions.fetchThread(paperId, discussionThreadId)
    );
    await store.dispatch(
      DiscussionActions.fetchComments(paperId, discussionThreadId, page)
    );

    discussion = store.getState().discussion;
  }

  return { discussion };
};

const BackButton = () => {
  const message = "Go back to all discussions";
  const router = useRouter();
  const url = getBackUrl(router.asPath);

  function getBackUrl(url) {
    let parts = url.split("/");
    parts.pop();
    parts = parts.join("/");
    return parts;
  }

  return (
    <div className={css(styles.backButtonContainer)}>
      <Link href={"/paper/[paperId]/[tabName]"} as={url}>
        <a className={css(styles.backButton)}>
          {icons.longArrowLeft} {message}
        </a>
      </Link>
    </div>
  );
};

const Thread = (props) => {
  const { title, body, username, date } = props;

  return (
    <div>
      <BackButton />
      <DiscussionCard
        top={
          <Fragment>
            <VoteWidget
              styles={styles.voteWidget}
              score={123}
              fontSize={"16px"}
              width={"58px"}
            />
            <div className={css(styles.threadTitle)}>{title}</div>
            <ShareButton />
          </Fragment>
        }
        info={<div className={css(styles.body)}>{body}</div>}
        infoStyle={styles.threadInfo}
        action={<DiscussionPostMetadata username={username} date={date} />}
      />
    </div>
  );
};

const ShareButton = () => {
  return <div className={css(styles.shareContainer)}>{icons.share}</div>;
};

class DiscussionComment extends React.Component {
  state = {
    id: this.props.data.id,
    date: this.props.data.createdDate,
    text: this.props.data.text,
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

  renderTop = () => {
    return (
      <Fragment>
        <VoteWidget score={0} />
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

class Comment extends DiscussionComment {
  constructor(props) {
    super(props);
    this.state.showReplyBox = false;
    this.state.replies = [];
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
      console.log(newReplies);
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

class Reply extends DiscussionComment {
  constructor(props) {
    super(props);
  }
}

function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingLeft: 68,
  },
  backButton: {
    color: colors.BLACK(0.5),
    textDecoration: "none",
  },
  threadContainer: {
    width: "80%",
    padding: "30px 0px",
    margin: "auto",
  },
  voteWidget: {
    marginRight: 18,
  },
  threadInfo: {
    paddingLeft: 68,
    color: colors.BLACK(0.8),
    "@media only screen and (min-width: 1024px)": {
      width: "calc(100% - 68px - 170px)",
    },
  },
  actionBar: {
    marginTop: 8,
    width: "100%",
  },
  threadTitle: {
    width: "100%",
    fontSize: 33,
  },
  body: {
    marginBottom: 28,
    marginTop: 14,
    fontSize: 16,
    lineHeight: "24px",
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
  shareContainer: {
    background: colors.LIGHT_GREY(),
    color: colors.GREY(),
    height: "46px",
    width: "46px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
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

export default DiscussionThreadPage;
