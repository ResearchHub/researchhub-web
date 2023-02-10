import { StyleSheet, css } from "aphrodite";
import colors, { iconColors } from "~/config/themes/colors";

const IconButton = ({ onClick, children, overrideStyle, size = 18 }) => {
  return (
    <div
      className={css(styles.root, styles.withAnimation, overrideStyle)}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        fontSize: size,
        lineHeight: `${size}px`,
      }}
    >
      {children}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: "5px",
    color: colors.BLACK(0.5),
    cursor: "pointer",
  },
  withAnimation: {
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
});

export default IconButton;
