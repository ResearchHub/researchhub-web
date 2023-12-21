import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

export const SideColumnTitle = (props) => {
  const { title, count, overrideStyles, onClick, state, children } = props;
  return (
    <h5
      className={css(styles.sidecolumnHeader, overrideStyles && overrideStyles)}
    >
      <div className={css(styles.titleContainer)}>
        {title ? title : null}
        {count ? <span className={css(styles.count)}>{count}</span> : null}
      </div>
      {children}
      {onClick && (
        <div className={css(styles.toggleButton)} onClick={onClick}>
          {state ? (
            <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
          )}
        </div>
      )}
    </h5>
  );
};

export const ClampedText = (props) => {
  const { lines = 1, textStyles } = props;

  const clampClass = ` clamp${lines}`;

  return (
    <span className={css(textStyles && textStyles) + clampClass}>
      {props.children}
    </span>
  );
};

const styles = StyleSheet.create({
  sidecolumnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textTransform: "uppercase",
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.BLACK(0.75),
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    padding: "0px 20px",
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
    justifyContent: "space-between",
    width: "100%",
  },
  count: {
    color: colors.BLUE(),
    marginLeft: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
