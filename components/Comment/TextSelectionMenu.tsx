import {
  faCommentDots,
  faLinkSimple,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

const TextSelectionMenu = ({ onCommentClick, onLinkClick }) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.option)} onClick={onCommentClick}>
        <FontAwesomeIcon icon={faCommentDots} />
      </div>
      <div className={css(styles.divider)} />
      <div className={css(styles.option)} onClick={onLinkClick}>
        <FontAwesomeIcon
          icon={faLinkSimple}
          style={{ transform: "rotate(-45deg)" }}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    boxShadow: "0px 4px 20px rgba(36, 31, 58, 0.1)",
    background: "white",
    borderRadius: "4px",
  },
  option: {
    fontSize: 20,
    padding: "10px 16px",
    ":hover": {
      color: colors.NEW_BLUE(1.0),
      cursor: "pointer",
    },
  },
  divider: {
    width: "75%",
    margin: "0 auto",
    borderBottom: `1px solid #E9EAEF`,
  },
});

export default TextSelectionMenu;
