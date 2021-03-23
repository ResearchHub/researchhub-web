import React, { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import ColumnContainer from "./ColumnContainer";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const PaperSections = (props) => {
  const {
    activeTab,
    setActiveTab,
    paperDraftExists,
    paperDraftSections,
    activeSection,
    setActiveSection,
  } = props;

  const [hidePaperSections, toggleHidePaperSections] = useState(false);

  useEffect(() => {}, [activeTab]);

  const handleClick = (i) => {
    setActiveTab(i);
    setTimeout(() => {
      activeTab !== i && setActiveTab(i);
    }, 20); // needed to override unwanted effect
  };

  const handleSectionClick = (i) => {
    const offset = 3;
    const index = i - offset;

    setActiveSection(index);
    setTimeout(() => {
      activeSection !== index && setActiveSection(index);
    }, 20);
  };

  const renderTabs = () => {
    const maintabs = [
      { name: "Main", index: 0 },
      { name: "Abstract", index: 1 },
      { name: "Discussion", index: 2 },
      { name: "Paper PDF", index: 3 },
    ];

    if (paperDraftExists) {
      maintabs.splice(2, 0, { name: "Paper", index: 2 });
      maintabs.forEach((section, i) => {
        section.index = i;
      });
    }

    if (paperDraftSections && paperDraftSections.length) {
      maintabs.splice(3, 0, ...paperDraftSections);
    }

    const isMainTab = (name) => {
      switch (name) {
        case "Main":
        case "Abstract":
        case "Discussion":
        case "Paper PDF":
        case "Paper":
          return true;
        default:
          return false;
      }
    };

    const isPaperSectionActive = (index) => {
      const offset = 3;

      return (
        paperDraftExists && activeTab === 2 && activeSection == index - offset
      );
    };

    return maintabs.map((section, sectionIndex) => {
      const { name, index } = section;

      if (isMainTab(name)) {
        return (
          <a
            href={`#${name.toLowerCase()}`}
            className={css(styles.card, activeTab === index && styles.active)}
            onClick={() => handleClick(index)}
          >
            <div className={css(styles.name) + " clamp1"}>{name}</div>
            {paperDraftExists && index === 2 && (
              <div
                className={css(styles.button)}
                onClick={(e) => {
                  e && e.stopPropagation();
                  toggleHidePaperSections(!hidePaperSections);
                }}
              >
                {hidePaperSections ? icons.chevronUp : icons.chevronDown}
              </div>
            )}
          </a>
        );
      } else {
        return (
          <a
            href={`#${section.toUpperCase()}`}
            className={css(
              styles.card,
              styles.small,
              isPaperSectionActive(sectionIndex) && styles.active,
              hidePaperSections && styles.hidden
            )}
            onClick={() => handleSectionClick(sectionIndex)}
          >
            <div className={css(styles.name) + " clamp1"}>{section}</div>
          </a>
        );
      }
    });
  };

  return (
    <ColumnContainer overrideStyles={styles.container}>
      <div className={css(styles.title)}>Page Navigation</div>
      {renderTabs()}
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
    justifyContent: "space-between",
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
    textTransform: "capitalize",
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
  hidden: {
    height: 0,
    visibility: "hidden",
    overflow: "hidden",
    userSelect: "none",
    display: "none",
  },
  button: {
    fontSize: 14,
    cursor: "pointer",
    color: colors.BLACK(0.6),
    ":hover": {
      color: colors.BLACK(),
    },
  },
});

export default PaperSections;
