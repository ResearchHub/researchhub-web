// NPM
import React, { useRef, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import HubTag from "./HubTag";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const HubDropDown = (props) => {
  let { hubs, hubName, isOpen, setIsOpen, labelStyle } = props;
  let dropdown; // holds ref for dropdown

  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */
  const handleOutsideClick = (e) => {
    if (dropdown && (dropdown.contains(e.target) || dropdown === e.target)) {
      e.stopPropagation();
      return;
    }

    if (dropdown && !dropdown.contains(e.target)) {
      e.stopPropagation();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={css(styles.container)}
      onClick={toggleDropdown}
      ref={(ref) => (dropdown = ref)}
    >
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
              overrideStyle={i !== hubs.length - 1 && styles.tagStyle}
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
    padding: "5px 0",
  },
  dropdown: {
    minWidth: 250,
    zIndex: 3,
    top: 20,
    right: -5,
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
  tagStyle: {
    marginBottom: 5,
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
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  active: {
    color: colors.BLUE(),
  },
});

export default HubDropDown;
