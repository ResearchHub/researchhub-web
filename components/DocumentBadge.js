import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import { badgeColors } from "~/config/themes/colors";
import icons, { PostIcon, PaperIcon } from "~/config/themes/icons";

const DocumentBadge = ({ docType, label, onClick }) => {
  return (
    <Badge onClick={onClick} badgeClassName={styles.badge}>
      {docType === "paper" ? (
        <span className={css(styles.icon)}>
          <PaperIcon />
        </span>
      ) : docType === "post" ? (
        <span className={css(styles.icon)}>
          <PostIcon />
        </span>
      ) : docType === "hypothesis" ? (
        <span className={css(styles.icon)}>{icons.file}</span>
      ) : null}
      <span>{label}</span>
    </Badge>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 6,
    color: "gray",
    fontSize: 16,
  },
  badge: {
    display: "flex",
    padding: "6px 12px 3px 12px",
    textTransform: "capitalize",
    backgroundColor: "unset",
    color: badgeColors.COLOR,
    marginBottom: 0,
    marginRight: 0,
    fontSize: 14,
    fontWeight: 500,
    ":hover": {
      background: badgeColors.HOVER,
      color: badgeColors.HOVER_COLOR,
      boxShadow: "unset",
    },
  },
});

export default DocumentBadge;
