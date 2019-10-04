import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";

const DiscussionCard = (props) => {
  const infoStyles = [styles.infoContainer];

  const { infoStyle } = props;
  if (infoStyle) {
    infoStyles.push(infoStyle);
  }

  return (
    <div className={css(styles.container)}>
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
  topContainer: {
    color: colors.BLACK(),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    width: "100%",
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
