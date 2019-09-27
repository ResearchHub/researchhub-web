import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import dynamic from "next/dynamic";
import moment from "moment";
import Avatar from "react-avatar";

import PaperTabBar from "~/components/PaperTabBar";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import PaperTab from "~/components/Paper/Tabs/PaperTab";

//Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const Paper = () => {
  const router = useRouter();
  const { paperId, tabName } = router.query;
  const [paper, setPaper] = useState({ authors: [] });

  useEffect(() => {
    getPaper();
  }, []);

  function renderTabContent() {
    switch (tabName) {
      case "summary":
        return <SummaryTab paperId={paperId} paper={paper} />;
      case "discussion":
        return <DiscussionTab paperId={paperId} />;
      case "full":
        return <PaperTab />;
      case "citations":
        return null;
    }
  }

  function getPaper() {
    fetch(API.PAPER({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setPaper(resp);
      });
  }

  function renderAuthors() {
    let authors = paper.authors.map((author, index) => {
      return (
        <div className={css(styles.authorContainer)}>
          <Avatar
            name={`${author.first_name} ${author.last_name}`}
            size={30}
            round={true}
            textSizeRatio="1"
          />
        </div>
      );
    });
    return authors;
  }

  // TODO: Display different tab content based on tabName
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.header)}>
        <div className={css(styles.title)}>{paper.title}</div>
        <div className={css(styles.authors)}>{renderAuthors()}</div>
        <div className={css(styles.infoSection)}>
          <div className={css(styles.info)}>
            Published {moment(paper.paper_publish_date).format("DD MMMM, YYYY")}
          </div>
          <div className={css(styles.info)}>DOI: {paper.doi}</div>
        </div>
      </div>
      <PaperTabBar baseUrl={paperId} selectedTab={tabName} />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
  },
  header: {
    padding: "30px 80px",
    width: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: 33,
    marginBottom: 10,
  },
  infoSection: {
    display: "flex",
  },
  info: {
    opacity: 0.5,
    fontSize: 14,
    marginRight: 20,
  },
  authors: {
    marginBottom: 10,
    display: "flex",
  },
  authorContainer: {
    marginRight: 5,
  },
});

export default Paper;
