import { Fragment, useEffect, useState } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";

// components
import { Comment } from "~/components/DiscussionComment";
import { CommentBox } from "~/components/DiscussionCommentBox";
import Thread from "~/components/DiscussionPageThread";

// Redux
import DiscussionActions from "~/redux/discussion";

// Utils
import colors, { discussionPageColors } from "~/config/themes/colors";
import { absoluteUrl, createUsername, isEmpty } from "~/config/utils";

const DiscussionThreadPage = (props) => {
  const { discussion, hostname } = props;

  const [comments, setComments] = useState([]);

  let title = "";
  let body = "";
  let username = "";
  let createdDate = "";
  let score = 0;
  let vote = null;

  if (discussion.success) {
    title = discussion.title;
    body = discussion.text;
    createdDate = discussion.createdDate;
    username = createUsername(discussion);
    score = discussion.score;
    vote = discussion.userVote;
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
          hostname={hostname}
          title={title}
          body={body}
          username={username}
          date={createdDate}
          vote={vote}
          score={score}
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

DiscussionThreadPage.getInitialProps = async ({ req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;
  let { discussion } = store.getState();

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

  return { discussion, hostname };
};

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
