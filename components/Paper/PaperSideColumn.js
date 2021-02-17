import { Fragment, useState } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Component
import { SideColumnTitle } from "~/components/Typography";
import LeaderboardPlaceholder from "~/components/Placeholders/LeaderboardPlaceholder";
import LeaderboardUser from "~/components/Leaderboard/LeaderboardUser";
import PaperJournalTag from "~/components/Paper/PaperJournalTag";

import { checkSummaryVote } from "~/config/fetch";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const PaperColumn = (props) => {
  const { paper } = props;
  const [activeTab, setActiveTab] = useState(0);

  const renderPaperTabs = () => {
    return (
      <div className={css(styles.tabs)}>
        <div
          className={css(styles.tab, styles.left, !activeTab && styles.active)}
          onClick={() => setActiveTab(0)}
        >
          Details
        </div>
        <div
          className={css(styles.tab, styles.right, activeTab && !styles.active)}
          onClick={() => setActiveTab(1)}
        >
          Discussion
        </div>
      </div>
    );
  };

  const renderAuthorsDetails = () => {
    const { user } = props;

    const authors = [user].map((user, index) => {
      let name = "Anonymous";
      let authorId = user.author_profile && user.author_profile.id;
      if (user.author_profile) {
        name =
          user.author_profile.first_name + " " + user.author_profile.last_name;
      }

      return (
        <Ripples className={css(styles.user)} key={`user_${index}_${user.id}`}>
          <LeaderboardUser
            user={user}
            name={name}
            authorProfile={user.author_profile}
            reputation={user.reputation || 300}
            authorId={authorId}
          />
        </Ripples>
      );
    });

    return (
      <Fragment>
        <SideColumnTitle
          title={"Author Details"}
          overrideStyles={styles.title}
        />
        {authors}
      </Fragment>
    );
  };

  return (
    <div className={css(styles.root)}>
      {renderPaperTabs()}
      {renderAuthorsDetails()}
      <SideColumnTitle title={"Journal"} overrideStyles={styles.title} />
      <PaperJournalTag
        url={paper.url}
        externalSource={paper.external_source}
        onFallback={() => false}
      />
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
    background: "#FAFAFA",
  },
  left: {
    borderRight: "1px solid #F0F0F0",
  },
  right: {
    borderLeft: "1px solid #F0F0F0",
  },
  active: {
    borderBottom: `1px solid ${colors.NEW_BLUE()}`,
    background: "#fff",
    // background: "linear-gradient(90deg, #3971FF 0%, rgba(57, 113, 255, 0) 100%)",
    // transform: 'rotate(-90deg)'
  },
  title: {
    marginTop: 20,
  },
  user: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 15px",
  },
});

export default PaperColumn;
