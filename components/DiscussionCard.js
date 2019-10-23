import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";

const DiscussionCard = (props) => {
  const infoStyles = [styles.infoContainer];

  const { infoStyle, hoverEvents } = props;
  if (infoStyle) {
    infoStyles.push(infoStyle);
  }

  return (
    <div className={css(styles.container, hoverEvents && styles.hoverEvents)}>
      <div className={css(styles.topContainer)}>{props.top}</div>
      <div className={css(infoStyles)}>
        {props.info}
        <div className={css(styles.actionContainer)}>{props.action}</div>
      </div>
    </div>
  );
};

DiscussionCard.propTypes = {
  top: PropTypes.node,
  info: PropTypes.node,
  infoStyle: PropTypes.object,
  action: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFF",
    padding: "15px 30px 15px 30px",
    borderRadius: 10,
    marginBottom: 5,
    border: "1px solid #FFFFFF",
  },
  hoverEvents: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: "rgba(243, 243, 248, 0.7)",
      // transform: "scale(1.01)",
    },
  },
  topContainer: {
    color: colors.BLACK(),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    // width: "100%",
    paddingLeft: 51,
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    color: colors.GREY(1),
    fontSize: 14,
  },
});

export default DiscussionCard;
