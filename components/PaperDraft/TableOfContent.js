import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const TableOfContent = (props) => {
  const { paperDraftSections, paperDraftExists } = props;

  const renderContent = () => {
    return paperDraftSections.map((section, index) => {
      return (
        <a href={`#${section}`} className={css(styles.link)}>
          {`${index + 1}. `}
          <span className={css(styles.section)}>{section}</span>
        </a>
      );
    });
  };
  return (
    <div className={css(styles.root, !paperDraftExists && styles.hidden)}>
      <h3 className={css(styles.title)}>Table of contents</h3>
      <div className={css(styles.sectionContainer)}>{renderContent()}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "block",
    },
  },
  hidden: {
    "@media only screen and (max-width: 767px)": {
      display: "hidden",
    },
  },
  title: {
    padding: "30px 0 20px 0",
    fontSize: 21,
    fontWeight: 500,
    color: colors.BLACK(),
    display: "flex",
    alignItems: "center",
    margin: 0,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  link: {
    textDecoration: "unset",
    textTransform: "capitalize",
    fontSize: 16,
    fontFamily: "CharterBT",
    color: colors.BLUE(),
    paddingBottom: 10,
    fontWeight: 500,
  },
  section: {
    ":hover": {
      textDecoration: "underline",
    },
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
  },
});

export default TableOfContent;
