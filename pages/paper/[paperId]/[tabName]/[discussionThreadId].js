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
import { doesNotExist, isEmpty } from "~/config/utils";

const DiscussionThreadPage = () => {
  const comments = [
    { key: "key", data: "data", text: "a comment" },
    {
      key: "key2",
      data: "data",
      text: "a much longer comment with a lot of stuff",
    },
  ];

  return (
    <div>
      <div className={css(styles.threadContainer)}>
        <Thread
          title={"This is the thread title"}
          body={"This is the body of the thread"}
        />
      </div>
      <div className={css(styles.contentContainer)}>
        {renderComments(comments)}
      </div>
    </div>
  );
};

DiscussionThreadPage.getInitialProps = async ({ isServer, store, query }) => {
  let { discussion } = store.getState();

  if (!discussion.id) {
    const { paperId, discussionThreadId } = query;
    const page = 1;
    store.dispatch(DiscussionActions.fetchThreadPending());
    store.dispatch(DiscussionActions.fetchCommentsPending());
    await store.dispatch(
      DiscussionActions.fetchThread(paperId, discussionThreadId)
    );
    await store.dispatch(
      DiscussionActions.fetchComments(discussionThreadId, page)
    );
  }

  return { isServer };
};

function renderComments(comments) {
  return comments.map((c) => {
    return <Comment key={c.key} data={c} />;
  });
}

const Thread = (props) => {
  const { title, body } = props;
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
        action={
          <DiscussionPostMetadata
            username={"Cindy Loo Hoo"}
            date={Date.now()}
          />
        }
      />
    </div>
  );
};

const BackButton = () => {
  const router = useRouter();
  const url = getBackUrl(router.asPath);

  const message = "Go back to all discussions";
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
  let text = "";

  const { data } = props;
  if (data && !isEmpty(data)) {
    // If data exists, we assume it has all of the expected fields.
    text = data.text;
  }

  return (
    <DiscussionCard
      top={
        <Fragment>
          <VoteWidget score={0} />
          <DiscussionPostMetadata
            username={"Severus Snape"}
            date={Date.now()}
          />
        </Fragment>
      }
      info={text}
      action={"Reply"}
    />
  );
};

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
