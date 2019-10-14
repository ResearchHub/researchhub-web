import { Fragment, useEffect, useState } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import { useDispatch, useStore } from "react-redux";

// Components
import { Comment } from "~/components/DiscussionComment";
import { CommentEditor } from "~/components/DiscussionCommentEditor";
import Thread from "~/components/DiscussionPageThread";

// Redux
import DiscussionActions from "~/redux/discussion";

// Utils
import colors, { discussionPageColors } from "~/config/themes/colors";
import { absoluteUrl } from "~/config/utils";

const DiscussionThreadPage = (props) => {
  const dispatch = useDispatch();
  const store = useStore();

  const { discussion, discussionThreadId, hostname, paperId } = props;

  const [thread, setThread] = useState(props.discussion);
  const [pageNumber, setPageNumber] = useState(1);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(
    props.discussion.success && props.discussion.userVote
  );

  let title = "";
  let body = "";
  let createdBy = "";
  let createdDate = "";
  let score = 0;

  if (thread.success) {
    title = thread.title;
    body = thread.text;
    createdBy = thread.createdBy;
    createdDate = thread.createdDate;
    score = thread.score;
  }

  useEffect(() => {
    if (thread.success) {
      const currentComments = thread.commentPage.comments;
      setComments(currentComments);
    }
  }, [discussion.success]);

  useEffect(() => {
    async function refetchDiscussion() {
      dispatch(DiscussionActions.fetchThreadPending());
      dispatch(DiscussionActions.fetchCommentsPending());
      await dispatch(
        DiscussionActions.fetchThread(paperId, discussionThreadId)
      );
      await dispatch(
        DiscussionActions.fetchComments(paperId, discussionThreadId, pageNumber)
      );

      const refetchedDiscussion = store.getState().discussion;

      setThread(refetchedDiscussion);
      setComments(refetchedDiscussion.commentPage.comments);
      setUserVote(refetchedDiscussion.userVote);
    }

    refetchDiscussion();
  }, [props.isServer]);

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
          createdBy={createdBy}
          date={createdDate}
          vote={userVote}
          score={score}
        />
      </div>
      <div className={css(styles.divider)} />
      <div className={css(styles.contentContainer)}>
        <CommentEditor onSubmit={addSubmittedComment} />
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

  return { discussion, discussionThreadId, hostname, paperId };
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
