import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import icons from "~/config/themes/icons";
import { doesNotExist } from "~/config/utils";

const DiscussionThreadActionBar = () => {
  return (
    <Fragment>
      <CommentCount count={3} />
      <Share />
    </Fragment>
  );
};

const CommentCount = (props) => {
  const { count } = props;
  return (
    <div className={css(styles.commentCountContainer)}>
      {count && (
        <Fragment>
          {icons.chat} {formatCommentCount(props.count)}
        </Fragment>
      )}
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
  commentCountContainer: {
    marginRight: "28px",
  },
});

export default DiscussionThreadActionBar;
