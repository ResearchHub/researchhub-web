import { css, StyleSheet } from "aphrodite";

import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import VoteWidget from "~/components/VoteWidget";

const DiscussionThreadPage = () => {
  return (
    <div>
      <Thread
        title={"This is the thread title"}
        body={"This is the body of the thread"}
      />
      <Comments />
    </div>
  );
};

const Thread = (props) => {
  const { title, body } = props;
  return (
    <div>
      <div className={css(styles.threadTopContainer)}>
        <VoteWidget score={123} fontSize={"16px"} width={"58px"} />
        <div>{title}</div>
        <ShareButton />
      </div>
      <div className={css(styles.threadBodyContainer)}>
        <div>{body}</div>
        <DiscussionPostMetadata username={"Cindy Loo Hoo"} date={Date.now()} />
      </div>
    </div>
  );
};

const Comments = () => {
  return <div>Comments</div>;
};

const ShareButton = () => {
  return <div>share</div>;
};

const styles = StyleSheet.create({
  threadTopContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  threadBodyContainer: {
    marginLeft: "58px",
  },
});

export default DiscussionThreadPage;
