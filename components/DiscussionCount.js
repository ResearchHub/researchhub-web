import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { PaperDiscussionIcon } from "~/config/themes/icons";
import colors, { discussionPageColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const DiscussionCount = ({ docType, count, id, slug }) => {
  if (!count || !id) {
    return null;
  }

  return (
    <Link
      href={`/${docType}/${id}/${slug}/conversation`}
      className={css(styles.link)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={css(styles.discussion)}>
        <div className={css(styles.discussionIcon)}>
          {PaperDiscussionIcon({})}
        </div>
        <div className={css(styles.discussionCount)}>{count}</div>
      </div>
    </Link>
  );
};

const styles = StyleSheet.create({
  discussionIcon: {
    color: colors.BLUE(),
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
  },
  discussion: {
    cursor: "pointer",
    position: "relative",
    fontSize: 14,
    background: discussionPageColors.ICON,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 40,
    width: 48,
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      minWidth: "unset",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
    },
    ":hover": {
      background: discussionPageColors.ICON_HOVER,
    },
  },
  discussionCount: {
    color: colors.BLUE(),
    fontWeight: "bold",
    marginLeft: 3,
    fontSize: 14,
  },
});

export default DiscussionCount;
