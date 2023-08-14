import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockKeyhole, faSitemap } from "@fortawesome/pro-solid-svg-icons";
import { faGlobe } from "@fortawesome/pro-regular-svg-icons";
import { CommentPrivacyFilter } from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import ReactTooltip from "react-tooltip";

const CommentPrivacyBadge = ({
  privacy,
  iconOnly,
}: {
  privacy: CommentPrivacyFilter;
  iconOnly?: boolean;
}) => {
  let icon;
  let label;
  let tip;
  if (privacy === "PUBLIC") {
    icon = <FontAwesomeIcon icon={faGlobe} />;
    label = "Public";
    tip = "Visible to everyone";
  } else if (privacy === "WORKSPACE") {
    icon = <FontAwesomeIcon icon={faSitemap} />;
    label = "Organization";
    tip = "Visible to members only";
  } else if (privacy === "PRIVATE") {
    icon = <FontAwesomeIcon icon={faLockKeyhole} />;
    label = "Private";
    tip = "Visible only to you";
  } else {
    console.error("Invalid privacy provided to CommentPrivacyBadge", privacy);
    return null;
  }

  return (
    <>
      <ReactTooltip
        effect="solid"
        className={css(styles.tooltip)}
        data-tip={tip}
        id="badge-tooltip"
      />
      <div
        className={css(styles.badge)}
        data-tip={tip}
        data-for="badge-tooltip"
      >
        <div className={css(styles.icon)}>{icon}</div>
        {!iconOnly && <div className={css(styles.label)}>{label}</div>}
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    width: 120,
    textAlign: "center",
  },
  badge: {
    display: "flex",
    columnGap: "7px",
    borderRadius: "4px",
    background: colors.privacyBadge.background,
    color: colors.privacyBadge.color,
    padding: "5px 10px",
  },
  icon: {
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
});

export default CommentPrivacyBadge;
