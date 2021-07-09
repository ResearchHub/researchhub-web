import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import ScrollMenu from "react-horizontal-scrolling-menu";

import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const HorizontalTabBar = ({
  tabs,
  onClick,
  alignCenter = false,
  dragging = false,
  containerStyle = null,
}) => {
  const renderTab = (tab, index) => {
    const { isSelected, label } = tab;

    return (
      <div
        key={label}
        className={css(styles.tab, isSelected && styles.selectedTab)}
        onClick={() => onClick(tab, index)}
      >
        {label}
      </div>
    );
  };

  const tabsHtml = tabs.map(renderTab);

  return (
    <div className={css(styles.container, containerStyle)}>
      <ScrollMenu
        data={tabsHtml}
        menuStyle={styles.tabContainer}
        alignCenter={alignCenter}
        dragging={dragging}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    boxSizing: "border-box",
    borderBottom: `1px solid ${colors.BLACK(0.1)}`,
  },
  tabContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
  },
  tab: {
    color: colors.BLACK(0.5),
    padding: "1rem",
    textTransform: "capitalize",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    ":active": {
      color: colors.PURPLE(),
      cursor: "pointer",
    },
    ":hover": {
      color: colors.PURPLE(),
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 16,
      fontSize: 16,
    },
  },
  selectedTab: {
    color: colors.PURPLE(),
    borderBottom: "solid 3px",
    borderColor: colors.PURPLE(),
  },
});

HorizontalTabBar.propTypes = {
  tabs: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HorizontalTabBar;
