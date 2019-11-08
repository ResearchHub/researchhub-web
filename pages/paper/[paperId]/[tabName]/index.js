import { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Router, { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";

// Components
import ActionButton from "~/components/ActionButton";
import ComponentWrapper from "~/components/ComponentWrapper";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import ShareAction from "~/components/ShareAction";
import VoteWidget from "~/components/VoteWidget";
import HubTag from "~/components/Hubs/HubTag";
import AuthorAvatar from "~/components/AuthorAvatar";

import { PaperActions } from "~/redux/paper";
import VoteActions from "~/redux/vote";

// Config
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import icons from "~/config/themes/icons";
import { absoluteUrl, getNestedValue, getVoteType } from "~/config/utils";
import PermissionNotificationWrapper from "../../../../components/PermissionNotificationWrapper";

const Paper = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const [paper, setPaper] = useState(props.paper);
  const [score, setScore] = useState(getNestedValue(paper, ["score"], 0));
  const [discussionThreads, setDiscussionThreads] = useState(
    getDiscussionThreads(paper)
  );
  const [selectedVoteType, setSelectedVoteType] = useState(
    getVoteType(paper.userVote)
  );

  const { hostname } = props;
  const { paperId, tabName } = router.query;
  const shareUrl = hostname + "/paper/" + paperId;

  const paperTitle = getNestedValue(paper, ["title"], "");
  const threadCount = getNestedValue(paper, ["discussion", "count"], 0);

  useEffect(() => {
    async function refetchPaper() {
      await dispatch(PaperActions.getPaper(paperId));
      const refetchedPaper = store.getState().paper;

      setPaper(refetchedPaper);
      setSelectedVoteType(getVoteType(refetchedPaper.userVote));
      setDiscussionThreads(getDiscussionThreads(refetchedPaper));
      this.props.messageActions.showMessage({ show: false });
    }
    refetchPaper();
  }, [props.isServer, paperId]);

  function getDiscussionThreads(paper) {
    return getNestedValue(paper, ["discussion", "threads"]);
  }

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
    const success = voteResult.success;
    const vote = getNestedValue(voteResult, ["vote"], false);

    if (success) {
      const voteType = vote.voteType;
      if (voteType === UPVOTE) {
        setSelectedVoteType(UPVOTE);
        setScore(score + 1);
      } else if (voteType === DOWNVOTE) {
        setSelectedVoteType(DOWNVOTE);
        setScore(score - 1);
      }
    }
  }

  let renderTabContent = () => {
    switch (tabName) {
      case "summary":
        return <SummaryTab paperId={paperId} paper={paper} />;
      case "discussion":
        return (
          <DiscussionTab
            hostname={hostname}
            paperId={paperId}
            threads={discussionThreads}
          />
        );
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
            <AuthorAvatar author={author} size={30} />
          </div>
        );
      });
    return authors;
  }

  function renderHubs() {
    let hubs =
      paper &&
      paper.hubs.map((hub, index) => {
        return <HubTag tag={hub} />;
      });
    return hubs;
  }

  function navigateToEditPaperInfo() {
    let href = "/paper/upload/info/[paperId]";
    let as = `/paper/upload/info/${paperId}`;
    Router.push(href, as);
  }

  return (
    <div className={css(styles.container)}>
      <Head title={paper.title} description={paper.tagline} />
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
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
            <span className={css(styles.mobileRow)}>
              <div className={css(styles.mobileVoting)}>
                <VoteWidget
                  score={score}
                  onUpvote={upvote}
                  onDownvote={downvote}
                  selected={selectedVoteType}
                  horizontalView={true}
                />
              </div>
              <div className={css(styles.actionButtons)}>
                <PermissionNotificationWrapper
                  modalMessage="edit papers"
                  onClick={navigateToEditPaperInfo}
                  permissionKey="UpdatePaper"
                  loginRequired={true}
                >
                  <ActionButton icon={"fas fa-pencil"} />
                </PermissionNotificationWrapper>
                <ShareAction
                  iconNode={icons.shareAlt}
                  title={"Share this paper"}
                  subtitle={paperTitle}
                  url={shareUrl}
                />
                <ActionButton icon={"fas fa-bookmark"} action={null} />
              </div>
            </span>
          </div>
          <div className={css(styles.mobileInfoSection)}>
            {paper.paper_publish_date && (
              <div className={css(styles.info)}>
                Published{" "}
                {moment(paper && paper.paper_publish_date).format(
                  "DD MMMM, YYYY"
                )}
              </div>
            )}
          </div>
          <div className={css(styles.tags)}>
            <div className={css(styles.authors)}>{renderAuthors()}</div>
            <div className={css(styles.hubs)}>{renderHubs()}</div>
          </div>
          <div className={css(styles.tagline)}>{paper && paper.tagline}</div>
          <div className={css(styles.mobileDoi)}>
            {paper.doi && (
              <div className={css(styles.info)}>DOI: {paper && paper.doi}</div>
            )}
          </div>
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
          <div className={css(styles.mobileTags)}>
            <div className={css(styles.authors)}>{renderAuthors()}</div>
            <div className={css(styles.hubs)}>{renderHubs()}</div>
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

Paper.getInitialProps = async ({ isServer, req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;

  await store.dispatch(PaperActions.getPaper(query.paperId));

  return { isServer, hostname };
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
    "@media only screen and (max-width: 415px)": {
      paddingTop: 20,
    },
  },
  header: {
    padding: "30px 0px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    "@media only screen and (max-width: 768px)": {
      marginLeft: 70,
      maxWidth: 600,
    },
    "@media only screen and (max-width: 700px)": {
      marginLeft: 0,
      maxWidth: "unset",
    },
  },
  title: {
    fontSize: 33,
    marginBottom: 10,
    position: "relative",
    "@media only screen and (max-width: 760px)": {
      // marginTop: 50,
      // marginBottom: 15,
      fontSize: 28,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 22,
    },
  },
  infoSection: {
    display: "flex",
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  info: {
    opacity: 0.5,
    fontSize: 14,
    marginRight: 20,
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  authors: {
    display: "flex",
    marginRight: 41,
    "@media only screen and (max-width: 760px)": {
      marginRight: 21,
    },
  },
  authorContainer: {
    marginRight: 5,
  },
  tags: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  hubs: {
    display: "flex",
    flexWrap: "wrap",
  },
  tagline: {
    fontSize: 16,
    marginTop: 25,
    marginBottom: 20,
    color: "#4e4c5f",
    fontFamily: "Roboto",
    "@media only screen and (max-width: 760px)": {
      marginTop: 20,
      marginBottom: 20,
    },
  },
  voting: {
    position: "absolute",
    width: 70,
    left: -80,
    top: 18,
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  mobileVoting: {
    display: "none",
    "@media only screen and (max-width: 760px)": {
      display: "flex",
    },
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 760px)": {},
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "@media only screen and (max-width: 760px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
  },
  mobileRow: {
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      justifyContent: "space-between",
      alignContent: "center",
      width: "100%",
    },
  },
  mobileInfoSection: {
    display: "none",
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      marginTop: 17,
      marginBottom: 20,
      fontSize: 14,
    },
  },
  mobileDoi: {
    display: "none",
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      opacity: 0.5,
      fontSize: 14,
    },
  },
  mobileTags: {
    display: "none",
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      alignItems: "center",
      marginTop: 20,
    },
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
  vote: state.vote,
});

export default connect(mapStateToProps)(Paper);
