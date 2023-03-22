// NPM
import { useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Config
import colors from "~/config/themes/colors";

import { nameToUrl } from "~/config/constants";

const HubDropDown = (props) => {
  const { hubs, hubName, isOpen, setIsOpen, labelStyle, containerStyle } =
    props;
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
    document.addEventListener("mouseup", handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  });

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const dropdownComponent = hubs.map((hub, i) => {
    let { id, name, hub_image, slug } = hub;

    return (
      <Link
        href={"/hubs/[slug]"}
        as={`/hubs/${nameToUrl(slug)}`}
        key={`dropdown-${id}`}
        className={css(styles.atag)}
      >
        <img
          className={css(styles.hubImage) + " hubImage"}
          src={hub_image ? hub_image : "/static/background/hub-placeholder.svg"}
          alt={name}
        />
        <span
          key={`hub_dropdown${id}`}
          className={css(styles.listItem) + " clamp1"}
        >
          {name}
        </span>
      </Link>
    );
  });

  return (
    <div
      className={css(styles.container, containerStyle)}
      onClick={toggleDropdown}
      ref={(ref) => (dropdown = ref)}
    >
      <div className={css(styles.icon, isOpen && styles.active, labelStyle)}>
        {`+${hubs.length} more`}
      </div>
      <div className={css(styles.dropdown, isOpen && styles.open)}>
        {dropdownComponent}
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
    minWidth: 200,
    top: 20,
    right: -5,
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    background: "#FAFAFA",
    border: "1px solid rgb(237, 237, 237)",
    borderRadius: 4,
    position: "absolute",
    boxSizing: "border-box",
    opacity: 0,
    userSelect: "none",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center",
    "@media only screen and (max-width: 500px)": {
      right: "unset",
      left: -125,
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
    color: colors.BLACK(),
    ":hover": {
      color: colors.BLUE(),
    },
  },
  active: {
    color: colors.BLUE(),
  },
  listItem: {
    color: colors.BLACK(),
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      height: "unset",
    },
  },
  hubImage: {
    height: 20,
    width: 20,
    minWidth: 20,
    minHeight: 20,
    marginRight: 8,
    objectFit: "cover",
    borderRadius: 3,
    dropShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
    opacity: 1,
    "@media only screen and (max-width: 767px)": {
      height: 18,
      width: 18,
      minWidth: 18,
      minHeight: 18,
    },
    "@media only screen and (max-width: 415px)": {
      height: 15,
      width: 15,
      minWidth: 15,
      minHeight: 15,
      marginRight: 4,
    },
  },
  atag: {
    display: "flex",
    padding: 10,
    alignItems: "center",
    color: "unset",
    boxSizing: "border-box",
    background: "#FAFAFA",
    borderBottom: "1px solid rgb(237, 237, 237)",
    textDecoration: "unset",
    width: "100%",
    cursor: "pointer",
    ":hover": {
      background: "#edeefe",
    },
  },
});

export default HubDropDown;
