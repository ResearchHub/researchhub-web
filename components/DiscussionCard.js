import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";

const DiscussionCard = (props) => {
  const infoStyles = [styles.infoContainer];

  const { infoStyle, hoverEvents, mobileView, containerStyle } = props;
  if (infoStyle) {
    infoStyles.push(infoStyle);
  }

  return (
    <div
      className={css(
        styles.container,
        hoverEvents && styles.hoverEvents,
        mobileView && styles.mobileContainer,
        containerStyle && containerStyle
      )}
    >
      <div className={css(styles.topContainer)}>{props.top}</div>
      <div className={css(infoStyles, mobileView && styles.mobileInfoStyles)}>
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
    backgroundColor: colors.WHITE(),
    padding: "15px 5px 15px 5px",
    borderRadius: 10,
    border: `1px solid ${colors.WHITE()}`,
    "@media only screen and (max-width: 415px)": {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  mobileContainer: {
    "@media only screen and (max-width: 415px)": {
      width: "calc(100% - 40px)",
      padding: 16,
      backgroundColor: colors.WHITE(),
      marginBottom: 10,
      ":hover": {
        // border: `solid 1px ${colors.LIGHT_GRAYISH_BLUE6()}`,
      },
    },
  },
  mobileContainer: {
    "@media only screen and (max-width: 415px)": {
      width: "calc(100% - 40px)",
      padding: 16,
      border: `solid 1px ${colors.LIGHT_GRAYISH_BLUE7()}`,
      backgroundColor: colors.WHITE(),
      marginBottom: 10,
      ":hover": {
        border: `solid 1px ${colors.LIGHT_GRAYISH_BLUE6()}`,
      },
    },
  },
  hoverEvents: {
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.PAPER_TAB_BACKGROUND(0.7),
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
    paddingLeft: 51,
  },
  mobileInfoStyles: {
    paddingLeft: 0,
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    color: colors.PURE_BLACK(),
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      justifyContent: "space-between",
    },
  },
});

export default DiscussionCard;
