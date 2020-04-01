import { useEffect, useState, useRef, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Router, { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";
import Joyride from "react-joyride";
import Error from "next/error";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import HubTag from "~/components/Hubs/HubTag";
import AuthorAvatar from "~/components/AuthorAvatar";
import PaperPageCard from "~/components/PaperPageCard";
import CitationCard from "~/components/Paper/CitationCard";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import VoteActions from "~/redux/vote";

// Config
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { absoluteUrl, getNestedValue, getVoteType } from "~/config/utils";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { formatPublishedDate } from "~/config/utils";

const Paper = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const isModerator = store.getState().auth.user.moderator;
  const [paper, setPaper] = useState(props.paper);
  const [score, setScore] = useState(getNestedValue(paper, ["score"], 0));
  const [flagged, setFlag] = useState(paper.user_flag !== null);
  const [sticky, setSticky] = useState(false);
  const [scrollView, setScrollView] = useState(false);
  const [discussionThreads, setDiscussionThreads] = useState(
    getDiscussionThreads(paper)
  );
  const [selectedVoteType, setSelectedVoteType] = useState(
    getVoteType(paper.userVote)
  );
  const [steps, setSteps] = useState([
    {
      target: ".first-step",
      title: "Edit Paper Info",
      content:
        "Add or edit the paper information. This includes authors, publication date, hubs, and more!",
      disableBeacon: true,
    },
    {
      target: ".second-step",
      title: "Add Paper Summary",
      content:
        "Add a summary to help others understand what the paper is about.",
      disableBeacon: true,
    },
  ]);
  const [discussionCount, setCount] = useState(
    store.getState().paper.discussion.count
  );

  const { hostname, showMessage } = props;
  const { paperId, tabName } = router.query;
  const shareUrl = hostname + "/paper/" + paperId;

  const paperTitle = getNestedValue(paper, ["title"], "");
  const paperCardRef = useRef(null);
  const keyTakeawayRef = useRef(null);
  const descriptionRef = useRef(null);
  const discussionRef = useRef(null);
  const citationRef = useRef(null);
  const paperPdfRef = useRef(null);

  useEffect(() => {
    async function refetchPaper() {
      await dispatch(PaperActions.getPaper(paperId));
      const fetchedPaper = store.getState().paper;
      await dispatch(PaperActions.getThreads(paperId, fetchedPaper));
      const refetchedPaper = store.getState().paper;

      setPaper(refetchedPaper);
      setSelectedVoteType(getVoteType(refetchedPaper.userVote));
      setDiscussionThreads(getDiscussionThreads(refetchedPaper));
      setFlag(refetchedPaper.user_flag !== null);
      showMessage({ show: false });
      if (props.auth.isLoggedIn && props.auth.user.upload_tutorial_complete) {
        props.setUploadingPaper(false);
      }
    }
    refetchPaper();
  }, [props.isServer, paperId]);

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
  }, [scrollListener]);

  function getDiscussionThreads(paper) {
    return paper.discussion.threads;
  }

  async function upvote() {
    dispatch(VoteActions.postUpvotePending());
    await dispatch(VoteActions.postUpvote(paperId));
    updateWidgetUI();
  }

  async function downvote() {
    dispatch(VoteActions.postDownvotePending());
    await dispatch(VoteActions.postDownvote(paperId));
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

  function onJoyrideComplete(joyrideState) {
    let { auth, updateUser, setUploadingPaper } = props;
    if (
      joyrideState.status === "finished" &&
      joyrideState.lifecycle === "complete"
    ) {
      fetch(
        API.USER({ userId: auth.user.id }),
        API.PATCH_CONFIG({ upload_tutorial_complete: true })
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(() => {
          updateUser({ upload_tutorial_complete: true });
          setUploadingPaper(false);
        });
    }
  }

  function scrollListener() {
    if (!scrollView && window.scrollY >= 415) {
      setScrollView(true);
      setSticky(true);
    } else if (scrollView && window.scrollY < 30) {
      setScrollView(false);
      setSticky(false);
    }
  }

  return (
    <div className={css(styles.container)}>
      {paper.status === 404 ? (
        <Error statusCode={paper.status} />
      ) : (
        <Fragment>
          <Head title={paper.title} description={paper.tagline} />
          <div
            className={css(scrollView && styles.stickyComponent)}
            ref={paperCardRef}
          >
            <ComponentWrapper overrideStyle={styles.componentWrapper}>
              <PaperPageCard
                paper={paper}
                score={score}
                upvote={upvote}
                downvote={downvote}
                selected={selectedVoteType}
                shareUrl={shareUrl}
                isModerator={isModerator}
                flagged={flagged}
                setFlag={setFlag}
                sticky={sticky}
                scrollView={scrollView}
                setSticky={setSticky}
              />
            </ComponentWrapper>
            <PaperTabBar
              baseUrl={paperId}
              selectedTab={tabName}
              discussionCount={discussionCount}
              paperCardRef={paperCardRef}
              keyTakeawayRef={keyTakeawayRef}
              descriptionRef={descriptionRef}
              discussionRef={discussionRef}
              paperPdfRef={paperPdfRef}
              citationRef={citationRef}
              paperCardRef={paperCardRef}
              sticky={sticky}
              setSticky={setSticky}
              scrollView={scrollView}
            />
          </div>
          <div
            className={css(
              styles.contentContainer,
              sticky && styles.scrollPadding
            )}
          >
            <SummaryTab
              paperId={paperId}
              paper={paper}
              keyTakeawayRef={keyTakeawayRef}
              descriptionRef={descriptionRef}
            />
            <div className={css(styles.space)} />
            <DiscussionTab
              hostname={hostname}
              paperId={paperId}
              threads={discussionThreads}
              discussionCount={discussionCount}
              setCount={setCount}
              discussionRef={discussionRef}
            />
            <ComponentWrapper overrideStyle={styles.componentWrapper}>
              <div className={css(styles.citationContainer)} ref={citationRef}>
                <div className={css(styles.header)}>
                  <div className={css(styles.citationTitle)}>Cited By</div>
                  <span className={css(styles.citationCount)}>
                    {paper.referenced_by.length > 0 &&
                      paper.referenced_by.length}
                  </span>
                </div>
                <div className={css(styles.citations)}>
                  {paper.referenced_by.length > 0 ? (
                    paper.referenced_by.map((reference, id) => {
                      return (
                        <CitationCard
                          key={`citation-${reference.id}-${id}`}
                          citation={reference}
                        />
                      );
                    })
                  ) : (
                    <div className={css(styles.citationEmpty)}>
                      There are no citations for this paper.
                    </div>
                  )}
                </div>
              </div>
            </ComponentWrapper>
            <PaperTab
              paperId={paperId}
              paper={paper}
              paperPdfRef={paperPdfRef}
            />
          </div>
          <Joyride
            steps={steps}
            continuous={true}
            locale={{ last: "Done" }}
            styles={{
              options: {
                primaryColor: colors.BLUE(1),
              },
            }}
            callback={onJoyrideComplete}
            run={
              props.auth.uploadingPaper &&
              props.auth.isLoggedIn &&
              !props.auth.user.upload_tutorial_complete
            }
          />
        </Fragment>
      )}
    </div>
  );
};

Paper.getInitialProps = async ({ isServer, req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;

  await store.dispatch(PaperActions.getPaper(query.paperId));
  const fetchedPaper = store.getState().paper;
  await store.dispatch(PaperActions.getThreads(query.paperId, fetchedPaper));

  return { isServer, hostname };
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
    backgroundColor: "#FAFAFA",
    minHeight: "100vh",
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
    wordBreak: "break-word",
    "@media only screen and (max-width: 760px)": {
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
    marginTop: 10,
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
    position: "absolute",
    top: 30,
    right: -175,
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 1033px)": {
      flexDirection: "column",
      justifyContent: "space-evenly",
      top: 20,
      right: -60,
      height: 160,
    },
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  buttonDivider: {
    height: 5,
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: "100%",
    background: colors.LIGHT_GREY(1),
    color: colors.GREY(1),
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    flexShrink: 0,
    "@media only screen and (max-width: 760px)": {
      width: 35,
      height: 35,
    },
    "@media only screen and (max-width: 415px)": {
      height: 33,
      width: 33,
    },
    "@media only screen and (max-width: 321px)": {
      height: 31,
      width: 31,
    },
  },
  hide: {
    display: "none",
  },
  space: {
    height: 30,
  },
  stickyComponent: {
    top: 80,
    position: "sticky",
    backgroundColor: "#FFF",
    zIndex: 3,
  },
  scrollPadding: {
    paddingTop: 450,
  },
  citationContainer: {
    backgroundColor: "#fff",
    padding: 50,
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    borderRadius: 4,
    marginTop: 30,
  },
  citations: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    minWidth: "100%",
    width: "100%",
    boxSizing: "border-box",
    overflowX: "scroll",
    paddingBottom: 10,
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  citationTitle: {
    fontSize: 22,
    fontWeight: 500,
  },
  citationCount: {
    color: "rgba(36, 31, 58, 0.5)",
    fontSize: 17,
    fontWeight: 500,
    marginLeft: 15,
  },
  citationEmpty: {
    fontSize: 20,
    fontWeight: 500,
    width: "100%",
    textAlign: "center",
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
  vote: state.vote,
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  updateUser: AuthActions.updateUser,
  setUploadingPaper: AuthActions.setUploadingPaper,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Paper);
