import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import { badgeColors } from "~/config/themes/colors";

const DocumentBadge = ({ docType, label, onClick }) => {
  return (
    <Badge
      label={label}
      onClick={onClick}
      badgeClassName={styles[`${docType}Badge`]}
    />
  );
};

const styles = StyleSheet.create({
  paperBadge: {
    padding: "1px 8px",
    textTransform: "capitalize",
    backgroundColor: badgeColors.PAPER.BACKGROUND,
    color: badgeColors.PAPER.COLOR,
    marginBottom: 0,
    display: "inline-block",
  },
  postBadge: {
    padding: "1px 8px",
    textTransform: "capitalize",
    backgroundColor: badgeColors.POST.BACKGROUND,
    color: badgeColors.POST.COLOR,
    marginBottom: 0,
    display: "inline-block",
  },
  hypothesisBadge: {
    padding: "1px 8px",
    textTransform: "capitalize",
    backgroundColor: badgeColors.HYPOTHESIS.BACKGROUND,
    color: badgeColors.HYPOTHESIS.COLOR,
    marginBottom: 0,
    display: "inline-block",
  },
});

export default DocumentBadge;
