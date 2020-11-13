// NPM
import React, { useRef, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import "~/components/Paper/CitationCard.css";

// Component
import HubTag from "./HubTag";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { nameToUrl } from "~/config/constants";

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
            <Link href={"/hubs/[slug]"} as={`/hubs/${nameToUrl(hub.slug)}`}>
              <a className={css(styles.atag)}>
                <div
                  key={`hub_dropdown${hub.id}`}
                  className={css(styles.listItem) + " clamp1"}
                >
                  {hub.name}
                </div>
              </a>
            </Link>
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
    minWidth: 200,
    zIndex: 3,
    top: 20,
    right: -5,
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    background: "#FAFAFA",
    border: "1px solid rgb(237, 237, 237)",
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
    "@media only screen and (max-width: 500px)": {
      right: "unset",
      left: -75,
      minWidth: 150,
    },
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
  },
  active: {
    color: colors.BLUE(),
  },
  listItem: {
    boxSizing: "border-box",
    padding: "8px 20px",
    cursor: "pointer",
    background: "#FAFAFA",
    borderBottom: "1px solid rgb(237, 237, 237)",
    color: colors.BLUE(),
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 10,
    ":hover": {
      background: "#edeefe",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 8,
      height: "unset",
    },
  },
  atag: {
    color: "unset",
    textDecoration: "unset",
    width: "100%",
  },
});

export default HubDropDown;
