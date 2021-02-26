import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import ColumnAuthors from "./ColumnAuthors";
import ColumnHubs from "./ColumnHubs";
import ColumnJournal from "./ColumnJournal";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const PaperSideColumn = (props) => {
  const { paper, paperId, authors, hubs } = props;
  const [activeTab, setActiveTab] = useState(0);

  const renderPaperTabs = () => {
    return (
      <div className={css(styles.tabs)}>
        <div
          className={css(styles.tab, styles.left, !activeTab && styles.active)}
          onClick={() => setActiveTab(0)}
        >
          <img
            src={"/static/ResearchHubIcon.png"}
            className={css(styles.rhIcon)}
          />
          Details
        </div>
        <div
          className={css(styles.tab, styles.right, activeTab && styles.active)}
          onClick={() => setActiveTab(1)}
        >
          <span className={css(styles.commentIcon)}>{icons.comments}</span>
          Discussion
        </div>
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      <ColumnAuthors paper={paper} authors={authors} paperId={paperId} />
      <ColumnHubs paper={paper} hubs={hubs} paperId={paperId} />
      <ColumnJournal paper={paper} paperId={paperId} />
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    border: "1.5px solid #F0F0F0",
    backgroundColor: "#fff",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    boxSizing: "border-box",
  },
  tabs: {
    width: "100%",
    display: "flex",
    cursor: "pointer",
  },
  tab: {
    height: 40,
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #F0F0F0",
    fontWeight: 500,
    background: "#FAFAFA",
  },
  left: {
    borderRight: "1px solid #F0F0F0",
  },
  right: {
    borderLeft: "1px solid #F0F0F0",
  },
  active: {
    border: "unset",
    borderBottom: `3px solid ${colors.NEW_BLUE()}`,
    background: "#fff",
    color: colors.BLUE(),
    background:
      "linear-gradient(0deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
    boxSizing: "border-box",
  },
  rhIcon: {
    width: 12,
    marginRight: 10,
  },
  commentIcon: {
    marginRight: 10,
    color: colors.BLUE(),
  },
});

export default PaperSideColumn;
