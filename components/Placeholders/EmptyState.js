import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

const EmptyState = (props) => {
  let { text, subtext, icon } = props;
  return (
    <div className={css(styles.emptyContainer)}>
      {icon ? (
        icon
      ) : (
        <div className={css(styles.icon)}>
          {<FontAwesomeIcon icon={faFile}></FontAwesomeIcon>}
        </div>
      )}
      <div>{text && text}</div>
      <div className={css(styles.subtext)}>{subtext && subtext}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    fontSize: 20,
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(),
    height: 50,
    marginBottom: 25,
  },
  subtext: {
    fontSize: 16,
    color: colors.BLACK(0.8),
    fontWeight: 400,
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
});

export default EmptyState;
