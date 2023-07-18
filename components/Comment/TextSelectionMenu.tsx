import {
  faCommentDots,
  faLinkSimple,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

type Props = {
  onCommentClick: (e) => void;
  onLinkClick: (e) => void;
  isHorizontal?: boolean;
};

const TextSelectionMenu = ({
  onCommentClick,
  onLinkClick,
  isHorizontal = false,
}: Props) => {
  return (
    <div className={css(styles.container, isHorizontal && styles.horizontal)}>
      <div className={css(styles.option)} onClick={onCommentClick}>
        <FontAwesomeIcon
          fontWeight={600}
          fontSize={isHorizontal ? 16 : 22}
          icon={faCommentDots}
        />
        {isHorizontal ? ` Comment` : ``}
      </div>
      <div
        className={css(
          styles.divider,
          isHorizontal && styles.dividerHorizontal
        )}
      />
      <div className={css(styles.option)} onClick={onLinkClick}>
        <FontAwesomeIcon
          fontSize={isHorizontal ? 16 : 22}
          fontWeight={600}
          icon={faLinkSimple}
          style={{ transform: "rotate(-45deg)" }}
        />
        {isHorizontal ? ` Link` : ``}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    boxShadow:
      "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
    background: "#F9FBFD",
    borderRadius: "4px",
    display: "inline-flex",
    flexDirection: "column",
    border: `1px solid #E9EAEF`,
    // height: 36,
    boxSizing: "border-box",
    overflow: "hidden",
    color: colors.NEW_BLUE(1.0),
  },
  horizontal: {
    flexDirection: "row",
  },
  option: {
    fontSize: 14,
    columnGap: "5px",
    padding: "16px 16px",
    display: "flex",
    alignItems: "center",
    ":hover": {
      cursor: "pointer",
      // color: colors.NEW_BLUE(1.0),
      background: colors.NEW_BLUE(0.1),
      transition: "0.2s",
    },
  },
  divider: {
    margin: "0 auto",
    display: "flex",
    borderLeft: "unset",
    borderBottom: `1px solid #E9EAEF`,
    width: "100%",
  },
  dividerHorizontal: {
    height: "100%",
    border: `1px solid rgb(104 104 104)`,
    borderLeft: `1px solid #E9EAEF`,
  },
});

export default TextSelectionMenu;
