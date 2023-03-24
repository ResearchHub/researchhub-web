import { StyleSheet, css } from "aphrodite";

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
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
});

export default ColumnContainer;
