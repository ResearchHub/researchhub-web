import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import Image from "next/image";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const MobileFeedTabs = (props) => {
  const { activeLeft, activeRight, onFeedSelect } = props;

  const onClick = async (left) => {
    const link = left ? "/" : "/my-hubs";
    await Router.push(link, link, { shallow: true });
    return onFeedSelect(left ? 0 : 1);
  };

  return (
    <div className={css(styles.tabs)}>
      <div
        className={css(
          styles.tab,
          styles.tabLeft,
          activeLeft && styles.active
        )}
        onClick={() => onClick(true)}
      >
        <span className={css(styles.icon)}>{icons.squares}</span>
        All
      </div>
      <div
        className={css(styles.tab, styles.tabRight, activeRight && styles.active)}
        onClick={() => onClick(false)}
      >
        <Image
          src={"/static/ResearchHubIcon.png"}
          alt="My Hubs"
          height={18}
          width={12}
          loading="eager"
          priority={true}
        />      
        My Hubs
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  tabs: {
    display: "none",
    "@media only screen and (max-width: 1199px)": {
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
    marginRight: 6,
  },
  icon: {
    // fontSize: 1,
    marginRight: 7,
    opacity: 1,
  },
});

export default MobileFeedTabs;
