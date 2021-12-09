import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

const EmptyState = (props) => {
  const { icon, message } = props;

  return (
    <div className={css(styles.box)}>
      <div className={css(styles.icon)}>{icon}</div>
      <h2 className={css(styles.noContent)}>{message}</h2>
    </div>
  );
};

const styles = StyleSheet.create({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  noContent: {
    color: colors.BLACK(1),
    fontSize: 20,
    fontWeight: 500,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      width: 280,
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: colors.BLUE(1),
    height: 50,
    marginBottom: 10,
  },
});

export default EmptyState;
