import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

import DiscussionCard from "~/components/DiscussionCard";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import VoteWidget from "~/components/VoteWidget";

import DiscussionActions from "~/redux/discussion";

import colors from "~/config/themes/colors";
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
      <div className={css(styles.contentContainer)}>
        {renderComments(comments)}
      </div>
    </div>
  );
};

function renderComments(comments) {
  return comments.map((c) => {
    return <Comment key={c.id} data={c} />;
  });
}

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

const BackButton = () => {
  const message = "Go back to all discussions";
  const router = useRouter();
  const url = getBackUrl(router.asPath);

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

function getBackUrl(url) {
  let parts = url.split("/");
  parts.pop();
  parts = parts.join("/");
  return parts;
}

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
    <DiscussionCard
      top={
        <Fragment>
          <VoteWidget score={0} />
          <DiscussionPostMetadata username={username} date={date} />
        </Fragment>
      }
      info={text}
      action={"Reply"}
    />
  );
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
  },
  threadTitle: {
    width: "100%",
  },
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
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
});

export default DiscussionThreadPage;
