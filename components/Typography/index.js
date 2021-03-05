import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

export const SideColumnTitle = ({
  title,
  count,
  overrideStyles,
  onClick,
  state,
}) => {
  return (
    <h5
      className={css(styles.sidecolumnHeader, overrideStyles && overrideStyles)}
    >
      <div className={css(styles.titleContainer)}>
        {title && title}
        <span className={css(styles.count)}>{count && count}</span>
      </div>
      {onClick && (
        <div className={css(styles.toggleButton)} onClick={onClick}>
          {state ? icons.chevronUp : icons.chevronDown}
        </div>
      )}
    </h5>
  );
};

export const HeaderOne = () => {};

export const HeaderTwo = () => {};

const styles = StyleSheet.create({
  sidecolumnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.BLACK(0.6),
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "0px 15px 0px 20px",
    "@media only screen and (max-width: 415px)": {
      fontSize: 11,
    },
  },
  toggleButton: {
    fontSize: 14,
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(),
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
  },
  count: {
    color: colors.BLUE(),
    marginLeft: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
