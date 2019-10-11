import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import ShareAction from "~/components/ShareAction";
import { ClientLinkWrapper } from "~/components/LinkWrapper";

import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { doesNotExist } from "~/config/utils";

const DYNAMIC_HREF = "/paper/[paperId]/[tabName]/[discussionThreadId]";

const DiscussionThreadActionBar = (props) => {
  const { hostname, threadPath, title } = props;
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
        subtitle={title}
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
          <ClientLinkWrapper
            styling={[styles.link]}
            dynamicHref={DYNAMIC_HREF}
            path={threadPath}
          >
            {icons.chat} {formatCommentCount(props.count)}
          </ClientLinkWrapper>
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
  link: {
    color: colors.GREY(),
  },
  shareContainer: {
    cursor: "pointer",
  },
});

export default DiscussionThreadActionBar;
