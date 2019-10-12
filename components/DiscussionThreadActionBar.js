import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
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
  const { count } = props;
  return (
    <Fragment>
      {count > 0 && (
        <div className={css(styles.commentCountContainer)}>
          <span className={css(styles.iconChat)}>{icons.chat}</span>
          <span className={"text"} style={style.text}>
            {formatCommentCount(props.count)}
          </span>
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
    ":hover": {
      color: colors.BLUE(1),
    },
    ":hover .text": {
      color: colors.BLUE(1),
    },
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
