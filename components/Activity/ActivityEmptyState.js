import { StyleSheet, css } from "aphrodite";

// Components
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const ActivityEmptyState = ({ myHubs }) => {
  const authorPlaceholder = {
    author_profile: null,
  };

  return (
    <div className={css(styles.emptystate)}>
      <span className={css(styles.activityFeedIcon)}>{icons.activtyFeed}</span>
      <span style={{ fontWeight: 500, marginBottom: 10 }}>No Activity.</span>
      {myHubs ? "Follow an author to get started!" : ""}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    width: "100%",
    padding: "0 20px 20px 20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityFeedIcon: {
    color: colors.BLUE(),
    fontSize: 16,
    marginBottom: 5,
  },
  emptystate: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px 20px 10px 20px",
    fontSize: 14,
  },
});

export default ActivityEmptyState;
