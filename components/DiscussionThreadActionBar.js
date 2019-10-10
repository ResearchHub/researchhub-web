import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import { ServerLinkWrapper } from "~/components/LinkWrapper";

import icons from "~/config/themes/icons";
import { doesNotExist } from "~/config/utils";

const DiscussionThreadActionBar = (props) => {
  return (
    <Fragment>
      <CommentCount {...props} />
      <Share />
    </Fragment>
  );
};

const CommentCount = (props) => {
  const { count, threadPath } = props;
  return (
    <Fragment>
      {count > 0 && (
        <div className={css(styles.commentCountContainer)}>
          <ServerLinkWrapper path={threadPath}>
            {icons.chat} {formatCommentCount(props.count)}
          </ServerLinkWrapper>
        </div>
      )}
    </Fragment>
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
  commentCountContainer: {
    marginRight: "28px",
  },
  shareContainer: {
    cursor: "pointer",
  },
});

export default DiscussionThreadActionBar;
