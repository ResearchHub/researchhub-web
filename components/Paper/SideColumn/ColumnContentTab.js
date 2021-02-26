import React, { useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import ColumnContainer from "./ColumnContainer";

// Config
import colors from "~/config/themes/colors";

const ColumnContentTab = (props) => {
  const { activeTab, setActiveTab, paperExists } = props;

  useEffect(() => {}, [activeTab]);

  const handleClick = (i) => {
    setActiveTab(i);
    setTimeout(() => {
      activeTab !== i && setActiveTab(i);
    }, 20);
  };

  const renderSections = () => {
    const sections = ["Main", "Abstract", "Discussions", "Paper PDF"];

    if (paperExists) {
      sections.splice(2, 0, "Paper");
    }

    return sections.map((name, i) => {
      return (
        <a
          href={`#${name.toLowerCase()}`}
          className={css(styles.card, activeTab === i && styles.active)}
          onClick={() => handleClick(i)}
        >
          <div className={css(styles.name) + " clamp1"}>{name}</div>
        </a>
      );
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
