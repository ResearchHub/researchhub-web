// NPM
import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import HubTag from "./HubTag";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const HubDropDown = (props) => {
  let { hubs, hubName, labelStyle } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={css(styles.container)} onClick={toggleDropdown}>
      <div className={css(styles.icon, isOpen && styles.active)}>
        {icons.ellipsisH}
      </div>
      <div className={css(styles.dropdown, isOpen && styles.open)}>
        {hubs.map((hub, i) => {
          return (
            <HubTag
              key={`hub_dropdown${hub.id}-${i}`}
              tag={hub}
              hubName={hubName}
              gray={false}
              labelStyle={labelStyle}
              last={i === hubs.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dropdown: {
    minWidth: 250,
    zIndex: 3,
    bottom: 25,
    right: 0,
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    background: "#FFF",
    border: "1px solid rgb(238, 238, 238)",
    borderRadius: 4,
    position: "absolute",
    boxSizing: "border-box",
    opacity: 0,
    zIndex: -100,
    userSelect: "none",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "10px 15px",
  },
  open: {
    opacity: 1,
    zIndex: 2,
    pointerEvents: "unset",
  },
  icon: {
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  active: {
    color: colors.BLUE(),
  },
});

export default HubDropDown;
