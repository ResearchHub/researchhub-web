import { css, StyleSheet } from "aphrodite";
import VoteWidget from "./VoteWidget";

const DiscussionThreadCard = () => {
  return (
    <div className={css(styles.container)}>
      <VoteWidget score={5} fontSize={16} width={"44px"} />
      <div className={css(styles.infoContainer)}>
        <div>User component</div>
        <div>Thread title</div>
        <div>Number of comments</div>
        <div>share button</div>
      </div>
      <div>read button</div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoContainer: {
    width: "100%",
  },
});

export default DiscussionThreadCard;
