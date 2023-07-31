import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/pro-regular-svg-icons";
import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";

// Config
import colors from "~/config/themes/colors";

const AuthorStatsDropdown = (props) => {
  const { authors, paper, paperId, hubs, isPaper } = props;
  const [showDropdown, toggleDropdown] = useState(false);

  return (
    <div className={css(styles.root, isPaper && styles.bottomBorderRadius)}>
      <div
        className={css(styles.header, showDropdown && styles.borderBottom)}
        onClick={() => toggleDropdown(!showDropdown)}
      >
        <div>{"Authors & Stats"}</div>
        <div className={css(styles.icon)}>
          {showDropdown ? (
            <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
          )}
        </div>
      </div>
      <div
        className={css(styles.dropdownContainer, !showDropdown && styles.hide)}
      >
        <PaperSideColumn {...props} customStyle={styles.customStyle} />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    border: `1.5px solid ${colors.VERY_LIGHT_GREY()}`,
    borderRadius: "0px 0px 4px 4px",
    boxSizing: "border-box",
    background: colors.WHITE(),
    display: "flex",
    flexDirection: "column",
  },
  bottomBorderRadius: {
    borderRadius: "0px",
    borderBottom: "none",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: colors.BLACK(),
    fontSize: 16,
    height: 50,
    fontWeight: 500,
    boxSizing: "border-box",
    padding: "0 20px 0 20px",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  borderBottom: {
    borderBottom: `1.5px solid ${colors.VERY_LIGHT_GREY()}`,
  },
  icon: {
    fontSize: 18,
    color: colors.BLACK(),
    ":hover": {
      color: colors.BLUE(),
    },
    ":active": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  customStyle: {
    border: "none",
    boxShadow: "none",
    "@media only screen and (max-width: 767px)": {
      marginBottom: 10,
    },
  },
  dropdownContainer: {
    width: "100%",
  },
  hide: {
    overflow: "none",
    height: 0,
    visibility: "hidden",
    opacity: 1,
    zIndex: -1,
  },
});

export default AuthorStatsDropdown;
