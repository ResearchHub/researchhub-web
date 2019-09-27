import { css, StyleSheet } from "aphrodite";

import colors from "~/config/themes/colors";

const DiscussionCard = (props) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.topContainer)}>{props.top}</div>
      <div className={css(styles.infoContainer)}>
        {props.info}
        <div className={css(styles.actionContainer)}>{props.action}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
    paddingLeft: "46px",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    color: colors.GREY(1),
    fontSize: 14,
  },
});

export default DiscussionCard;
