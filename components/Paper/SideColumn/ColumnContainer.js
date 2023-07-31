import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

const ColumnContainer = (props) => {
  const { overrideStyles, onClick } = props;

  return (
    <div
      className={css(styles.root, overrideStyles && overrideStyles)}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    backgroundColor: colors.WHITE(),
    boxSizing: "border-box",
  },
});

export default ColumnContainer;
