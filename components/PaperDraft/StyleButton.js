import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

const StyleButton = (props) => {
  const { isStyleActive, label, onClick } = props;
  return (
    <span
      className={css([styles.button, isStyleActive && styles.active])}
      onClick={onClick}
    >
      {label}
    </span>
  );
};

const styles = StyleSheet.create({
  button: {
    color: colors.DARK_GRAY153(),
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0",
    display: "inline-block",
  },
  active: {
    color: colors.LIGHT_BLUE3(),
  },
});

export default StyleButton;
