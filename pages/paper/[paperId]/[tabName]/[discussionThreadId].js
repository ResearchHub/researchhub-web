import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

import DiscussionCard from "~/components/DiscussionCard";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import TextEditor from "~/components/TextEditor";
import VoteWidget from "~/components/VoteWidget";

import DiscussionActions from "~/redux/discussion";

import colors, { discussionPageColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { isEmpty } from "~/config/utils";

const DiscussionThreadPage = (props) => {
  const { discussion } = props;

  let title = "";
  let body = "";
  let comments = [];
  let username = "";
  let createdDate = "";

  if (discussion) {
    title = discussion.title;
    body = discussion.text;
    comments = discussion.commentPage.comments;
    createdDate = discussion.createdDate;
    username = createUsername(discussion);
  }

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
        {renderComments(comments)}
        <MoreButton />
        <CommentBox />
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
      <Link href={"/paper/[paperId]/discussion"} as={url}>
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
            <VoteWidget score={123} fontSize={"16px"} width={"58px"} />
            <div className={css(styles.threadTitle)}>{title}</div>
            <ShareButton />
          </Fragment>
        }
        info={<div>{body}</div>}
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

  const { data } = props;
  if (data && !isEmpty(data)) {
    date = data.createdDate;
    text = data.text;
    username = createUsername(data);
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
        info={text}
        infoStyle={styles.commentInfo}
        action={"Reply"}
      />
    </div>
  );
};

const MoreButton = () => {
  // TODO: Fetch more comments
  return <div>Show More Comments</div>;
};

const CommentBox = () => {
  function onSubmit(value) {
    console.log("CommentBox", value);
  }

  return (
    <div className={css(styles.commentBoxContainer)}>
      <TextEditor submitButton={<SubmitButton onClick={onSubmit} />} />
    </div>
  );
};

const SubmitButton = (props) => {
  const { onClick } = props;
  return <button onClick={onClick}>Submit</button>;
};

function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingLeft: "60px",
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
  threadInfo: {
    paddingLeft: "80px",
    color: colors.BLACK(0.8),
  },
  threadTitle: {
    width: "100%",
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
  commentContainer: {
    padding: "30px 30px 36px 30px",
    width: "100%",
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
