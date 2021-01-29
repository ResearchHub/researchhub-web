import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const MobileFeedTabs = (props) => {
  const { activeLeft, activeRight, onFeedSelect } = props;

  const onClick = async (left) => {
    const link = left ? "/" : "/all";
    await Router.push(link, link, { shallow: true });
    return onFeedSelect(left ? 0 : 1);
  };

  return (
    <div className={css(styles.tabs)}>
      <div
        className={css(styles.tab, styles.tabLeft, activeLeft && styles.active)}
        onClick={() => onClick(true)}
      >
        <img
          src={"/static/ResearchHubIcon.png"}
          className={css(styles.rhIcon)}
        />
        My Hubs
      </div>
      <div
        className={css(
          styles.tab,
          styles.tabRight,
          activeRight && styles.active
        )}
        onClick={() => onClick(false)}
      >
        <span className={css(styles.icon)}>{icons.squares}</span>
        All
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  tabs: {
    display: "none",
    "@media only screen and (max-width: 760px)": {
      width: "100%",
      display: "flex",
    },
  },
  tab: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    padding: "20px 0 15px",
    cursor: "pointer",
    background: "#fff",
    fontWeight: 500,
    borderBottom: "1px solid #EDEDED",
    fontSize: 14,
    color: colors.BLACK(0.6),
    ":hover": {
      color: colors.BLUE(),
    },
  },
  tabLeft: {
    borderRight: "1px solid #EDEDED",
  },
  tabRight: {
    borderLeft: "1px solid #EDEDED",
  },
  active: {
    border: "none",
    background: "unset",
    color: colors.BLUE(),
  },
  rhIcon: {
    // height: 30,
    width: 12,
    marginRight: 6,
  },
  icon: {
    // fontSize: 1,
    marginRight: 7,
    opacity: 1,
  },
});

export default MobileFeedTabs;
