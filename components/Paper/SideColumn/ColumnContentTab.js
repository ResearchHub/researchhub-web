import React, { useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import ColumnContainer from "./ColumnContainer";

// Config
import colors from "~/config/themes/colors";

const ColumnContentTab = (props) => {
  const { activeTab, setActiveTab, paperExists, sections } = props;

  useEffect(() => {}, [activeTab]);

  const handleClick = (i) => {
    setActiveTab(i);
    setTimeout(() => {
      activeTab !== i && setActiveTab(i);
    }, 20);
  };

  const renderSections = () => {
    const allsections = [
      { name: "Main", index: 0 },
      { name: "Abstract", index: 1 },
      { name: "Discussions", index: 2 },
      { name: "Paper PDF", index: 3 },
    ];

    if (paperExists) {
      allsections.splice(2, 0, { name: "Paper", index: 2 });
      allsections.forEach((section, i) => {
        section.index = i;
      });
    }

    if (sections && sections.length > 0) {
      allsections.splice(3, 0, ...sections);
    }

    const isPaperContent = (name) => {
      switch (name) {
        case "Main":
        case "Abstract":
        case "Discussions":
        case "Paper PDF":
        case "Paper":
          return true;
        default:
          return false;
      }
    };

    return allsections.map((section) => {
      const { name, index } = section;

      if (isPaperContent(name)) {
        return (
          <a
            href={`#${name.toLowerCase()}`}
            className={css(styles.card, activeTab === index && styles.active)}
            onClick={() => handleClick(index)}
          >
            <div className={css(styles.name) + " clamp1"}>{name}</div>
          </a>
        );
      } else {
        return (
          <a
            href={`#${section.toLowerCase()}`}
            className={css(styles.card, styles.small)}
          >
            <div className={css(styles.name) + " clamp1"}>{section}</div>
          </a>
        );
      }
    });
  };

  return (
    <ColumnContainer overrideStyles={styles.container}>
      <div className={css(styles.title)}>Sections</div>
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
    display: "flex",
    alignItems: "center",
    background: "#fff",
    boxSizing: "border-box",
    height: 40,
    fontWeight: 500,
    paddingLeft: 20,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.BLACK(0.6),
    textTransform: "uppercase",
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
    textDecoration: "unset",
    transition: "all ease-out 0.1s",
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      color: colors.BLACK(1),
    },
  },
  small: {
    fontSize: 14,
    paddingLeft: 20,
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
