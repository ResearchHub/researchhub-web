import Link from "next/link";
import { css, StyleSheet } from "aphrodite";

import DiscussionPostMetadata from "./DiscussionPostMetadata";
import VoteWidget from "./VoteWidget";
import { doesNotExist } from "~/config/utils";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const DiscussionThreadCard = (props) => {
  const title =
    "Bitcoin falls 12% as one of the world's biggest cryptocurrency markets readies a bill to ban trading on all exchanges.";
  let date = Date.now();
  const username = "Julia Kinderman";
  const threadId = 1;
  const { path } = props;

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.topContainer)}>
        <VoteWidget score={5} fontSize={16} width={"44px"} />
        <DiscussionPostMetadata username={username} date={date} />
        <ReadButton threadPath={path} threadId={threadId} />
      </div>
      <div className={css(styles.infoContainer)}>
        <Title text={title} />
        <div className={css(styles.actionContainer)}>
          <CommentCount count={2} />
          <Share />
        </div>
      </div>
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

const ReadButton = (props) => {
  const { threadPath } = props;
  return (
    <Link href={threadPath}>
      <div className={css(styles.readContainer)}>
        Read <span className={css(styles.readArrow)}>{icons.chevronRight}</span>
      </div>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {},
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
    paddingLeft: "46px",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "12px",
    whiteSpace: "nowrap",
  },
  timestampContainer: {
    width: "100%",
    color: colors.GREY(1),
    fontWeight: "normal",
  },
  timestampDivider: {
    padding: "0px 10px",
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
  readContainer: {
    border: "solid 1px",
    borderColor: colors.BLUE(1),
    color: colors.BLUE(1),
    borderRadius: "2px",
    height: "30px",
    width: "90px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    fontWeight: "lighter",
    boxSizing: "border-box",
  },
  readArrow: {
    fontSize: 10,
    marginLeft: "9px",
  },
  title: {
    fontSize: "22px",
    paddingBottom: "10px",
  },
});

export default DiscussionThreadCard;
