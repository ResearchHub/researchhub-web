import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import ShareAction from "~/components/ShareAction";
import { ServerLinkWrapper } from "~/components/LinkWrapper";

import icons from "~/config/themes/icons";
import { doesNotExist } from "~/config/utils";

const DiscussionThreadActionBar = (props) => {
  const { hostname, threadPath } = props;
  const shareUrl = hostname + threadPath;

  const customButton = (
    <div className={css(styles.shareContainer)}>{icons.share} Share</div>
  );

  return (
    <Fragment>
      <CommentCount {...props} />
      <ShareAction
        customButton={customButton}
        title={"Share this discussion"}
        url={shareUrl}
      />
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

const styles = StyleSheet.create({
  commentCountContainer: {
    marginRight: "28px",
  },
  shareContainer: {
    cursor: "pointer",
  },
});

export default DiscussionThreadActionBar;
