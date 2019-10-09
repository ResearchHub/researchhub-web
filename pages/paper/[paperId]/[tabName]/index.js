import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import { connect, useStore } from "react-redux";
import moment from "moment";
import Avatar from "react-avatar";

// Components
import PaperTabBar from "~/components/PaperTabBar";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import ComponentWrapper from "~/components/ComponentWrapper";
import VoteWidget from "~/components/VoteWidget";
import ActionButton from "~/components/ActionButton";

import { PaperActions } from "~/redux/paper";
import VoteActions from "~/redux/vote";

// Config
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import colors from "~/config/themes/colors";
import { getNestedValue } from "~/config/utils";

const Paper = (props) => {
  const store = useStore();
  const router = useRouter();
  const { paperId, tabName } = router.query;
  let { paper } = props;

  const threadCount = getNestedValue(paper, ["discussion", "count"], 0);
  const discussionThreads = getNestedValue(paper, ["discussion", "threads"]);
  const score = getNestedValue(paper, ["score"], 0);
  const userVote = getNestedValue(paper, ["userVote"], null);

  const [selectedVoteType, setSelectedVoteType] = useState(
    userVote && userVote.voteType
  );

  async function upvote() {
    props.dispatch(VoteActions.postUpvotePending());
    await props.dispatch(VoteActions.postUpvote(paperId));
    updateWidgetUI();
  }

  async function downvote() {
    props.dispatch(VoteActions.postDownvotePending());
    await props.dispatch(VoteActions.postDownvote(paperId));
    updateWidgetUI();
  }

  function updateWidgetUI() {
    const voteResult = store.getState().vote;
    const vote = getNestedValue(voteResult, ["vote"], false);

    if (vote) {
      const voteType = vote.voteType;
      if (voteType === UPVOTE) {
        setSelectedVoteType(UPVOTE);
      } else if (voteType === DOWNVOTE) {
        setSelectedVoteType(DOWNVOTE);
      }
    }
  }
  let renderTabContent = () => {
    switch (tabName) {
      case "summary":
        return <SummaryTab paperId={paperId} paper={paper} />;
      case "discussion":
        return <DiscussionTab paperId={paperId} threads={discussionThreads} />;
      case "full":
        return <PaperTab />;
      case "citations":
        return null;
    }
  };

  function renderAuthors() {
    let authors =
      paper &&
      paper.authors.map((author, index) => {
        return (
          <div className={css(styles.authorContainer)} key={`author_${index}`}>
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

  function renderHubs() {
    let hubs =
      paper &&
      paper.hubs.map((hub, index) => {
        return (
          <div className={css(styles.hubTag)}>{hub.name.toUpperCase()}</div>
        );
      });
    return hubs;
  }

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper>
        <div className={css(styles.header)}>
          <div className={css(styles.voting)}>
            <VoteWidget
              score={score}
              onUpvote={upvote}
              onDownvote={downvote}
              selected={selectedVoteType}
            />
          </div>
          <div className={css(styles.topHeader)}>
            <div className={css(styles.title)}>{paper && paper.title}</div>
            <div className={css(styles.actionButtons)}>
              <ActionButton icon={"fas fa-pencil"} action={null} />
              <ActionButton icon={"fas fa-share-alt"} action={null} />
              <ActionButton icon={"fas fa-bookmark"} action={null} />
            </div>
          </div>
          <div className={css(styles.tags)}>
            <div className={css(styles.authors)}>{renderAuthors()}</div>
            <div className={css(styles.hubs)}>{renderHubs()}</div>
          </div>
          <div className={css(styles.tagline)}>{paper && paper.tagline}</div>
          <div className={css(styles.infoSection)}>
            {paper.paper_publish_date && (
              <div className={css(styles.info)}>
                Published{" "}
                {moment(paper && paper.paper_publish_date).format(
                  "DD MMMM, YYYY"
                )}
              </div>
            )}
            {paper.doi && (
              <div className={css(styles.info)}>DOI: {paper && paper.doi}</div>
            )}
          </div>
        </div>
      </ComponentWrapper>
      <PaperTabBar
        baseUrl={paperId}
        selectedTab={tabName}
        threadCount={threadCount}
      />
      <div className={css(styles.contentContainer)}>{renderTabContent()}</div>
    </div>
  );
};

Paper.getInitialProps = async ({ store, isServer, query }) => {
  let { paper } = store.getState();

  if (!paper.id) {
    await store.dispatch(PaperActions.getPaper(query.paperId));
  }

  return { isServer };
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
  },
  header: {
    padding: "30px 0px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
  },
  title: {
    fontSize: 33,
    marginBottom: 10,
    position: "relative",
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
    display: "flex",
    marginRight: 15,
  },
  authorContainer: {
    marginRight: 5,
  },
  tags: {
    display: "flex",
    marginBottom: 10,
  },
  hubTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.BLUE(1),
    background: colors.BLUE(0.1),
    padding: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 13,
    borderRadius: 4,
  },
  hubs: {
    display: "flex",
  },
  tagline: {
    fontSize: 16,
    marginBottom: 10,
  },
  voting: {
    position: "absolute",
    width: 70,
    left: -80,
    top: 15,
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
  vote: state.vote,
});

export default connect(mapStateToProps)(Paper);
