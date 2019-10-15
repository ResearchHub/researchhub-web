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

  return (
    <Fragment>
      <CommentCount {...props} />
      <ShareAction
        customButton={<Share />}
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
            <span id={"chatIcon"} className={css(styles.iconChat)}>
              {icons.chat}
            </span>
            <span className={"text"} style={style.text}>
              {formatCommentCount(props.count)}
            </span>
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

const Share = () => {
  return (
    <div className={css(styles.shareContainer)}>
      <span className={css(styles.iconChat)}>{icons.share}</span>
      <span className={"text"} style={style.text}>
        Share
      </span>
    </div>
  );
};

const style = {
  text: {
    fontFamily: "Roboto",
    fontSize: 14,
    marginLeft: 8,
    color: "#918f9b",
  },
};

const styles = StyleSheet.create({
  commentCountContainer: {
    marginRight: "20px",
    marginLeft: -1,
    padding: 4,
    borderRadius: 5,
    ":hover .text": {
      color: colors.BLUE(1),
    },
    ":hover #chatIcon": {
      color: colors.BLUE(1),
    },
  },
  link: {
    color: colors.GREY(),
  },
  shareContainer: {
    cursor: "pointer",
    padding: 4,
    borderRadius: 5,
    ":hover": {
      color: colors.BLUE(1),
    },
    ":hover .text": {
      color: colors.BLUE(1),
    },
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 14,
    marginLeft: 8,
    color: "#918f9b",
  },
});

export default DiscussionThreadActionBar;
