import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

type Args = {
  onClick: Function;
  children?: any;
  overrideStyle?: any;
};

const IconButton = ({ onClick, children, overrideStyle }: Args) => {
  return (
    <div
      className={css(styles.root, styles.withAnimation, overrideStyle)}
      onClick={(e) => onClick(e)}
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
    justifyContent: "center",
    display: "inline-flex",
    userSelect: "none",
    alignItems: "center",
    columnGap: "5px",
  },
  withAnimation: {
    ":hover": {
      background: colors.LIGHTER_GREY(),
      borderRadius: 3,
      transition: "0.3s",
    },
  },
});

export default IconButton;
