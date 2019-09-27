import { css, StyleSheet } from "aphrodite";

import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import VoteWidget from "~/components/VoteWidget";
import DiscussionCard from "~/components/DiscussionCard";

const DiscussionThreadPage = () => {
  const comments = [
    { key: "key", data: "data", text: "a comment" },
    { key: "key", data: "data", text: "a much longer comment with a lot of stuff" },
  ];

  return (
    <div>
      <Thread
        title={"This is the thread title"}
        body={"This is the body of the thread"}
      />
      {renderComments(comments)}
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

function renderComments(comments) {
  return comments.map((c) => {
    return (
      <DiscussionCard
        key={c.key}
        info={c.text}
      />
    );
  });
}

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
