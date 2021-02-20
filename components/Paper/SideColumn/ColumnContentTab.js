import React, { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Component
import ColumnContainer from "./ColumnContainer";
import { SideColumnTitle } from "~/components/Typography";

// Config
import colors from "~/config/themes/colors";

const ColumnContentTab = (props) => {
  const { activeTab, setActiveTab } = props;

  useEffect(() => {}, [activeTab]);

  const handleClick = (i) => {
    setActiveTab(i);
  };

  const renderSections = () => {
    return ["Main", "Abstract", "Discussions", "Paper"].map((name, i) => {
      return (
        <div
          className={css(styles.card, activeTab === i && styles.active)}
          onClick={() => handleClick(i)}
        >
          <div className={css(styles.name) + " clamp1"}>{name}</div>
        </div>
      );
    });
  };
  return (
    <ColumnContainer overrideStyles={styles.container}>
      <div className={css(styles.title)}>Sections</div>
      {/* <span className={css(styles.title)}>
        Sections
      </span> */}
      {renderSections()}
    </ColumnContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "sticky",
    top: 20,
  },
  title: {
    // padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    // borderBottom: `3px solid ${colors.NEW_BLUE()}`,
    background: "#fff",
    // color: colors.BLUE(),
    color: colors.BLACK(),
    // background:
    //   "linear-gradient(0deg, rgba(57, 113, 255, 0.1) 20%, rgba(57, 113, 255, 0) 100%)",
    boxSizing: "border-box",
    height: 40,
    fontWeight: 500,
    paddingLeft: 20,
    // color: colors.BLACK(),
  },
  card: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: 10,
    borderLeft: `3px solid #FFF`,
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      color: colors.BLACK(1),
    },
  },
  name: {
    fontWeight: 500,
    marginLeft: 10,
  },
  active: {
    background: "#FAFAFA",
    borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    color: colors.BLACK(1),
  },
});

export default ColumnContentTab;
