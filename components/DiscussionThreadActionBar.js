import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/pro-solid-svg-icons";
import { faComment } from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import { ClientLinkWrapper } from "~/components/LinkWrapper";

import colors from "~/config/themes/colors";

import { doesNotExist } from "~/config/utils/nullchecks";

const DYNAMIC_HREF = "/paper/[paperId]/[paperName]/[discussionThreadId]";

const DiscussionThreadActionBar = (props) => {
  const { hostname, threadPath, title, comment } = props;
  const shareUrl = hostname + threadPath;

  return (
    <Fragment>
      <CommentCount {...props} />
    </Fragment>
  );
};

const CommentCount = (props) => {
  const { count, threadPath } = props;
  return (
    <Fragment>
      <div className={css(styles.commentCountContainer)}>
        <ClientLinkWrapper
          styling={[styles.link]}
          dynamicHref={DYNAMIC_HREF}
          path={threadPath}
        >
          <span className={css(styles.iconChat)} id={"chatIcon"}>
            {<FontAwesomeIcon icon={faComment}></FontAwesomeIcon>}
          </span>
          <span className={css(styles.text)} id={"text"}>
            {formatCommentCount(props.count, props.comment)}
          </span>
        </ClientLinkWrapper>
      </div>
    </Fragment>
  );
};

function formatCommentCount(count, isComment) {
  const suffix = isComment
    ? count === 0 || count > 1
      ? "replie"
      : "reply"
    : "comment";
  const s = "s";

  if (count < 1 || doesNotExist(count)) {
    return "0" + " " + suffix + s;
  } else if (count < 2) {
    return count + " " + suffix;
  }
  return count + " " + suffix + s;
}

const Share = () => {
  return (
    <div className={css(styles.shareContainer)}>
      <span className={css(styles.iconChat)} id={"shareIcon"}>
        {<FontAwesomeIcon icon={faShare}></FontAwesomeIcon>}
      </span>
      <span className={css(styles.text)} id={"text"}>
        Share
      </span>
    </div>
  );
};

const styles = StyleSheet.create({
  commentCountContainer: {
    display: "none",
    marginRight: "20px",
    marginLeft: -1,
    padding: 4,
    borderRadius: 5,
    cursor: "pointer",
    ":hover #text": {
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
    ":hover #text": {
      color: colors.BLUE(1),
    },
    ":hover #shareIcon": {
      color: colors.BLUE(1),
    },
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 14,
    marginLeft: 8,
    color: "#918f9b",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  iconChat: {
    color: "#918f9b",
  },
});

export default DiscussionThreadActionBar;
