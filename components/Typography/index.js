import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

export const SideColumnTitle = ({ title, overrideStyles }) => {
  return (
    <h5
      className={css(styles.sidecolumnHeader, overrideStyles && overrideStyles)}
    >
      <span>{title && title}</span>
    </h5>
  );
};

export const HeaderOne = () => {};

export const HeaderTwo = () => {};

const styles = StyleSheet.create({
  sidecolumnHeader: {
    textTransform: "uppercase",
    fontWeight: 500,
    // fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#a7a6b0",
    // color: colors.BLACK(),
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "0px 15px 0px 20px",
    // marginBottom: 10,
  },
});
