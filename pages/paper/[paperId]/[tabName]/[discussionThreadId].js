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
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import TextEditor from "~/components/TextEditor";
import VoteWidget from "~/components/VoteWidget";

// Redux
import DiscussionActions from "~/redux/discussion";

// Utils
import colors, { discussionPageColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { isEmpty } from "~/config/utils";

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
          {icons.longArrowLeft}
          <span className={css(styles.backButtonLabel)}>{message}</span>
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

const Comment = (props) => {
  let date = "";
  let text = "";
  let username = "";

  const [reply, setReply] = useState(false);

  const { data } = props;

  if (data && !isEmpty(data)) {
    date = data.createdDate;
    text = deserializeComment(data.text);
    username = createUsername(data);
  }

  function deserializeComment(text) {
    try {
      text = Value.fromJSON(JSON.parse(text));
    } catch (SyntaxError) {
      text = Plain.deserialize(text);
    }
    return text;
  }

  return (
    <div className={css(styles.commentContainer)}>
      <DiscussionCard
        top={
          <Fragment>
            <VoteWidget score={0} />
            <DiscussionPostMetadata username={username} date={date} />
          </Fragment>
        }
        info={
          <TextEditor readOnly={true} canEdit={false} initialValue={text} />
        }
        infoStyle={styles.commentInfo}
        action={
          <div className={css(styles.actionBar)}>
            {!reply ? (
              <div className={css(styles.reply)} onClick={() => setReply(true)}>
                Reply
              </div>
            ) : (
              <TextEditor canEdit={true} commentEditor={true} />
            )}
          </div>
        }
      />
    </div>
  );
};

const CommentBox = (props) => {
  const { onSubmit } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const { paperId, discussionThreadId } = router.query;

  async function postComment(text) {
    dispatch(DiscussionActions.postCommentPending());
    await dispatch(
      DiscussionActions.postComment(paperId, discussionThreadId, text)
    );

    const comment = store.getState().discussion.postedComment;
    onSubmit(comment);
  }

  return (
    <div className={css(styles.commentBoxContainer)}>
      <TextEditor
        canEdit={true}
        canSubmit={true}
        onSubmit={postComment}
        commentEditor={true}
      />
    </div>
  );
};

function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingLeft: 68,
    marginBottom: 10,
  },
  backButton: {
    color: colors.BLACK(0.5),
    textDecoration: "none",
    ":hover": {
      color: colors.BLACK(1),
    },
  },
  backButtonLabel: {
    marginLeft: 10,
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
