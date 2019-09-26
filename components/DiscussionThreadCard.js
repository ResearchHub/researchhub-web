import { css, StyleSheet } from "aphrodite";

import VoteWidget from "./VoteWidget";
import { doesNotExist } from "~/config/utils";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const DiscussionThreadCard = () => {
  const title =
    "Bitcoin falls 12% as one of the world's biggest cryptocurrency markets readies a bill to ban trading on all exchanges.";

  return (
    <div className={css(styles.container)}>
      <VoteWidget score={5} fontSize={16} width={"44px"} />
      <div className={css(styles.infoContainer)}>
        <User name={"Julia Kinderman"} />
        <Title text={title} />
        <div className={css(styles.actionContainer)}>
          <CommentCount count={2} />
          <Share />
        </div>
      </div>
      <div>read button</div>
    </div>
  );
};

const User = (props) => {
  const { image, name } = props;

  return (
    <div className={css(styles.userContainer)}>
      <img src={image} />
      <div>{name}</div>
    </div>
  );
};

const Title = (props) => {
  const title = formatTitle(props.text);

  return <div className={css(styles.title)}>{title}</div>;
};

function formatTitle(title) {
  const limit = 80;
  if (title.length > limit) {
    return title.substring(0, limit) + "...";
  }
  return title;
}

const CommentCount = (props) => {
  return (
    <div className={css(styles.commentCountContainer)}>
      {icons.chat} {formatCommentCount(props.count)}
    </div>
  );
};

function formatCommentCount(count) {
  const suffix = "comment";
  const s = "s";

  if (count < 1 || doesNotExist(count)) {
    return;
  } else if (count < 2) {
    return count + " " + suffix;
  }
  return count + " " + suffix + s;
}

const Share = () => {
  return <div className={css(styles.shareContainer)}>{icons.share} Share</div>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoContainer: {
    width: "100%",
    padding: "18px 12px 0px 12px",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    color: colors.GREY(1),
    fontSize: 14,
  },
  commentCountContainer: {
    marginRight: "28px",
  },
  title: {
    fontSize: "22px",
    padding: "10px 0px",
  },
});

export default DiscussionThreadCard;
