import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import { badgeColors } from "~/config/themes/colors";
import icons, { PostIcon } from "~/config/themes/icons";

const DocumentBadge = ({ docType, label, onClick }) => {
  return (
    <Badge onClick={onClick} badgeClassName={styles[`${docType}Badge`]}>
      {docType === "paper" ? (
        <span className={css(styles.icon)}>{icons.file}</span>
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
  paperBadge: {
    display: "flex",
    padding: "3px 8px",
    textTransform: "capitalize",
    backgroundColor: badgeColors.PAPER.BACKGROUND,
    color: badgeColors.PAPER.COLOR,
    marginBottom: 0,
    fontSize: 14,
    fontWeight: 500,
    // border: "1px solid",
  },
  postBadge: {
    display: "flex",
    padding: "3px 8px",
    textTransform: "capitalize",
    backgroundColor: badgeColors.POST.BACKGROUND,
    color: badgeColors.POST.COLOR,
    marginBottom: 0,
    fontSize: 14,
    fontWeight: 500,
  },
  hypothesisBadge: {
    display: "flex",
    padding: "3px 8px",
    textTransform: "capitalize",
    backgroundColor: badgeColors.HYPOTHESIS.BACKGROUND,
    color: badgeColors.HYPOTHESIS.COLOR,
    marginBottom: 0,
    fontSize: 14,
    fontWeight: 500,
  },
});

export default DocumentBadge;
