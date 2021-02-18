import { Fragment, useState } from "react";
import Router from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { SideColumnTitle } from "~/components/Typography";
import LeaderboardPlaceholder from "~/components/Placeholders/LeaderboardPlaceholder";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import LeaderboardUser from "~/components/Leaderboard/LeaderboardUser";
import PaperJournalTag from "~/components/Paper/PaperJournalTag";
import JournalCard from "../Journal/JournalCard";
import ColumnAuthor from "./ColumnAuthor";

import { checkSummaryVote } from "~/config/fetch";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { getJournalFromURL, capitalize } from "~/config/utils";

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

  const renderAuthorsDetails = () => {
    const { authors } = props;
    // console.log("authors", authors)

    const list = (authors || []).map((name, index) => {
      return <ColumnAuthor name={name} key={`user_${index}`} />;
    });

    if (list && list.length) {
      return (
        <Fragment>
          <SideColumnTitle
            title={"Author Details"}
            overrideStyles={styles.title}
          />
          <div className={css(styles.authors)}>{list}</div>
        </Fragment>
      );
    } else {
      return null;
    }
  };

  const renderHubEntry = () => {
    const { hubs } = props;

    return (hubs || []).map((hub, i) => {
      const { name, id, hub_image, user_is_subscribed } = hub;

      return (
        <Ripples
          className={css(styles.hubEntry, i === hubs.length - 1 && styles.last)}
          key={`${id}-${i}`}
        >
          <Link
            href={{
              pathname: "/hubs/[slug]",
              query: {
                name: `${hub.name}`,

                slug: `${encodeURIComponent(hub.slug)}`,
              },
            }}
            as={`/hubs/${encodeURIComponent(hub.slug)}`}
          >
            <a className={css(styles.hubLink)}>
              <img
                className={css(styles.hubImage)}
                src={
                  hub_image
                    ? hub_image
                    : "/static/background/hub-placeholder.svg"
                }
                alt={hub.name}
              />
              <span className={"clamp1"}>{name}</span>
            </a>
          </Link>
        </Ripples>
      );
    });
  };

  return (
    <div className={css(styles.root)}>
      {renderPaperTabs()}
      {renderAuthorsDetails()}
      <SideColumnTitle title={"Journal"} overrideStyles={styles.title} />
      <ReactPlaceholder
        showLoadingAnimation
        ready={paper.url || paper.external_source}
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
      >
        <JournalCard paper={paper} />
      </ReactPlaceholder>
      <SideColumnTitle title={"Hubs"} overrideStyles={styles.title} />
      <ReactPlaceholder
        showLoadingAnimation
        ready={paper}
        customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={2} />}
      >
        {renderHubEntry()}
      </ReactPlaceholder>
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
    position: "sticky",
    top: 15,
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
    borderBottom: `3px solid ${colors.NEW_BLUE()}`,
    background: "#fff",
    color: colors.BLUE(),
    background:
      "linear-gradient(0deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
    boxSizing: "border-box",
  },
  title: {
    marginTop: 20,
  },
  authors: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  user: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 15px",
  },

  hubEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    transition: "all ease-out 0.1s",
    borderRadius: 3,
    borderBottom: "1px solid #F0F0F0",
    borderLeft: "3px solid #FFF",
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
    ":active": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
    ":focus": {
      color: colors.NEW_BLUE(),
      background:
        "linear-gradient(90deg, rgba(57, 113, 255, 0.1) 0%, rgba(57, 113, 255, 0) 100%)",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  last: {
    opacity: 1,
    borderBottom: "none",
  },
  hubImage: {
    height: 35,
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    borderRadius: 4,
    objectFit: "cover",
    marginRight: 10,
    background: "#EAEAEA",
    border: "1px solid #ededed",
  },
  hubLink: {
    textDecoration: "none",
    color: "#111",
    width: "100%",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    padding: "10px 20px",
  },
  rhIcon: {
    width: 12,
    // marginLeft: 3,
    marginRight: 10,
  },
  commentIcon: {
    marginRight: 10,
    // color: "#EDEDED"
  },
});

export default PaperColumn;
