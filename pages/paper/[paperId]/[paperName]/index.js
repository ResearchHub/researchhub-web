import { useEffect, useState, useRef, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";

import { connect, useDispatch, useStore } from "react-redux";
import Joyride from "react-joyride";
import Error from "next/error";
import "./styles/anchor.css";
import * as Sentry from "@sentry/browser";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
// import KeyTakeawaysTab from "~/components/Paper/Tabs/KeyTakeawaysTab";
import PaperPageCard from "~/components/PaperPageCard";
import PaperTransactionModal from "~/components/Modals/PaperTransactionModal";
import PaperFeatureModal from "~/components/Modals/PaperFeatureModal";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import VoteActions from "~/redux/vote";
import { LimitationsActions } from "~/redux/limitations";
import { BulletActions } from "~/redux/bullets";

// Config
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import {
  absoluteUrl,
  getNestedValue,
  getVoteType,
  formatPaperSlug,
} from "~/config/utils";
import { checkSummaryVote } from "~/config/fetch";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import {
  convertToEditorValue,
  convertDeltaToText,
  isQuillDelta,
} from "~/config/utils/";
import * as shims from "~/redux/paper/shims";

const isServer = () => typeof window === "undefined";

const Paper = (props) => {
  const router = useRouter();
  if (props.error) {
    return <Error statusCode={404} />;
  }

  if (props.redirectPath && typeof window !== "undefined") {
    // updates the [paperName] without refetching data
    router.replace("/paper/[paperId]/[paperName]", props.redirectPath, {
      shallow: true,
    });
  }

  const dispatch = useDispatch();
  const store = useStore();

  const [paper, setPaper] = useState(
    (props.paper && shims.paper(props.paper)) || {}
  );
  const [summary, setSummary] = useState(
    (props.paper && props.paper.summary) || {}
  );
  const [score, setScore] = useState(getNestedValue(props.paper, ["score"], 0));

  const [showAllSections, toggleShowAllSections] = useState(false);
  const [loadingPaper, setLoadingPaper] = useState(!props.fetchedPaper);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [flagged, setFlag] = useState(props.paper && props.paper.user_flag);
  const [sticky, setSticky] = useState(false);
  const [scrollView, setScrollView] = useState(false);
  const [selectedVoteType, setSelectedVoteType] = useState(
    getVoteType(props.paper && props.paper.userVote)
  );
  const [figureCount, setFigureCount] = useState();
  const [discussionCount, setCount] = useState(
    calculateCommentCount(props.paper)
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
  const [tabs, setTabs] = useState(getActiveTabs());
  const [fetchBullets, setFetchBullets] = useState(false);
  const [userVoteChecked, setUserVoteChecked] = useState(false);

  const { hostname } = props;
  const { paperId, tabName } = router.query;

  const paperCardRef = useRef(null);
  const paperTabsRef = useRef(null);
  const keyTakeawayRef = useRef(null);
  const descriptionRef = useRef(null);
  const discussionRef = useRef(null);
  const citationRef = useRef(null);
  const paperPdfRef = useRef(null);

  const isModerator = store.getState().auth.user.moderator;
  const isSubmitter =
    paper.uploaded_by && paper.uploaded_by.id === props.auth.user.id;

  let summaryVoteChecked = false;

  const fetchPaper = ({ paperId }) => {
    setLoadingPaper(true);
    return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setLoadingPaper(false);
        let currPaper = shims.paper(resp);
        setScore(getNestedValue(currPaper, ["score"], 0));
        setFlag(currPaper.user_flag);
        setSelectedVoteType(getVoteType(currPaper.userVote));
        setCount(calculateCommentCount(currPaper));
        setPaper(currPaper);
        setSummary(currPaper.summary || {});
        checkUserVote(currPaper);
        return currPaper;
      })
      .catch((error) => {
        console.log(error);
        Sentry.captureException(error);
      });
  };

  useEffect(() => {
    setTabs(getActiveTabs());

    const summaryId = summary.id;
    if (summaryId && !summaryVoteChecked) {
      checkSummaryVote({ summaryId: summaryId }).then((res) => {
        const summaryUserVote = res[summaryId];
        summaryVoteChecked = true;

        let summary = {
          ...paper.summary,
          user_vote: summaryUserVote,
        };

        if (summaryUserVote) {
          summary.score = summaryUserVote.score || 0;
          summary.promoted = summaryUserVote.promoted;
        }
        setSummary(summary);
        setLoadingSummary(false);
      });
    }
    setLoadingSummary(false);
  }, [summary.id, props.auth.isLoggedIn]);

  function checkUserVote(paperState = paper) {
    if (props.auth.isLoggedIn && props.auth.user) {
      const params = { paperIds: [paperId] };
      return fetch(API.CHECK_USER_VOTE(params), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          const paperUserVote = res[paperId];

          if (paperUserVote) {
            const { bullet_low_quality, summary_low_quality } = paperUserVote;
            const updatedPaper = {
              ...paperState,
              bullet_low_quality,
              summary_low_quality,
            };
            updatedPaper.userVote = paperUserVote;
            setPaper(updatedPaper);
            setSelectedVoteType(updatedPaper.userVote.vote_type);
          }
          return setUserVoteChecked(true);
        });
    }
  }

  useEffect(() => {
    setPaper((props.paper && shims.paper(props.paper)) || {});
  }, [props.paper]);

  useEffect(() => {
    if (!props.fetchedPaper) {
      fetchPaper({ paperId });
    } else {
      checkUserVote();
    }
    if (document.getElementById("structuredData")) {
      let script = document.getElementById("structuredData");
      script.textContext = formatStructuredData();
    } else {
      let script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("id", "structuredData");
      script.textContext = formatStructuredData();
      document.head.appendChild(script);
    }
  }, [paperId]);

  useEffect(() => {
    if (Object.keys(paper).length !== 0) {
      checkUserVote();
    }
  }, [props.auth.isLoggedIn]);

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
  }, [scrollListener]);

  useEffect(() => {
    setCount(calculateCommentCount(paper));
  }, [paper.discussionSource]);

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
        setScore(selectedVoteType === DOWNVOTE ? score + 2 : score + 1);
        if (paper.promoted !== false) {
          setPaper({
            ...paper,
            promoted:
              selectedVoteType === UPVOTE
                ? paper.promoted + 2
                : paper.promoted + 1,
          });
        }
        setSelectedVoteType(UPVOTE);
      } else if (voteType === DOWNVOTE) {
        setScore(selectedVoteType === UPVOTE ? score - 2 : score - 1);
        if (paper.promoted !== false) {
          setPaper({
            ...paper,
            promoted:
              selectedVoteType === UPVOTE
                ? paper.promoted - 2
                : paper.promoted - 1,
          });
        }
        setSelectedVoteType(DOWNVOTE);
      }
    }
  }

  const restorePaper = () => {
    let currPaper = { ...paper };
    currPaper.is_removed = false;
    setPaper(currPaper);
  };

  const removePaper = () => {
    let currPaper = { ...paper };
    currPaper.is_removed = true;
    setPaper(currPaper);
  };

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
    if (!scrollView && window.scrollY >= 5) {
      setScrollView(true);
      setSticky(true);
    } else if (scrollView && window.scrollY < 30) {
      setScrollView(false);
      setSticky(false);
    }
  }

  function getActiveTabs() {
    let tabs = [
      { href: "main", label: "main" },
      // { href: "takeaways", label: "key takeaways" },
    ];

    tabs.push({ href: "summary", label: "abstract" });
    tabs.push({ href: "comments", label: "discussions" });
    if (paper.file || paper.url || showAllSections) {
      tabs.push({ href: "paper", label: "Paper PDF" });
    }

    return tabs;
  }

  function calculateCommentCount(paper) {
    let discussionCount = 0;
    if (paper) {
      discussionCount = paper.discussion_count;
    }
    return discussionCount;
  }

  function formatDescription() {
    if (paper) {
      if (paper.summary) {
        if (paper.summary.summary) {
          if (paper.summary.summary_plain_text) {
            return paper.summary.summary_plain_text;
          }
          if (isQuillDelta(paper.summary.summary)) {
            return convertDeltaToText(paper.summary.summary);
          }
          return convertToEditorValue(paper.summary.summary).document.text;
        }
      } else if (paper.abstract) {
        return paper.abstract;
      } else if (paper.tagline) {
        return paper.tagline;
      } else {
        return "";
      }
    }
  }

  function formatStructuredData() {
    let data = {
      "@context": "https://schema.org/",
      name: paper.title,
      keywords: paper.title + "researchhub" + "research hub",
      description: formatDescription(),
    };

    let image = [];

    if (paper.first_preview) {
      image.push(paper.first_preview);
    }
    if (paper.first_figure) {
      image.push(paper.first_figure);
    }
    if (image.length) {
      data["image"] = image;
    }
    if (paper.authors && paper.authors.length > 0) {
      let author = paper.authors[0];
      let authorData = {
        "@type": "Person",
        name: `${author.first_name} ${author.last_name}`,
      };

      data.author = authorData;
    }

    if (
      paper.paper_publish_date &&
      typeof paper.paper_publish_date === "string"
    ) {
      let date = paper.paper_publish_date.split("-");
      date.pop();
      date = date.join("-");
      data["datePublished"] = date;
    }

    return data;
  }

  let socialImageUrl = paper.metatagImage;

  if (!socialImageUrl) {
    socialImageUrl = paper.first_preview && paper.first_preview.file;
  }

  function updatePaperState(newState) {
    setPaper(newState);
  }

  return (
    <div className={css(styles.container)}>
      <PaperTransactionModal
        paper={paper}
        updatePaperState={updatePaperState}
      />
      <PaperFeatureModal
        paper={paper}
        updatePaperState={updatePaperState}
        updateSummary={setSummary}
      />
      <Fragment>
        <Head
          title={paper.title}
          description={formatDescription()}
          socialImageUrl={socialImageUrl}
          noindex={paper.is_removed || paper.is_removed_by_user}
          canonical={`https://www.researchhub.com/paper/${paper.id}/${paper.slug}`}
        />
        <div className={css(styles.paperPageContainer)}>
          <ComponentWrapper overrideStyle={styles.componentWrapper}>
            <PaperPageCard
              paper={paper}
              paperId={paperId}
              score={score}
              upvote={upvote}
              downvote={downvote}
              selectedVoteType={selectedVoteType}
              shareUrl={process.browser && window.location.href}
              isModerator={isModerator}
              isSubmitter={isSubmitter}
              flagged={flagged}
              restorePaper={restorePaper}
              removePaper={removePaper}
              doneFetchingPaper={!loadingPaper}
              setFlag={setFlag}
              sticky={sticky}
              scrollView={scrollView}
              setSticky={setSticky}
            />
          </ComponentWrapper>
        </div>
        <div className={css(styles.stickyComponent)} ref={paperTabsRef}>
          <PaperTabBar
            baseUrl={paperId}
            selectedTab={tabName}
            paperCardRef={paperCardRef}
            keyTakeawayRef={keyTakeawayRef}
            descriptionRef={descriptionRef}
            discussionRef={discussionRef}
            paperPdfRef={paperPdfRef}
            citationRef={citationRef}
            paperTabsRef={paperTabsRef}
            sticky={sticky}
            setSticky={setSticky}
            scrollView={scrollView}
            tabName={tabName}
            paper={paper}
            activeTabs={tabs}
            showAllSections={showAllSections}
            updatePaperState={updatePaperState}
          />
        </div>
        <div className={css(styles.contentContainer)}>
          {/* <KeyTakeawaysTab
            keyTakeawayRef={keyTakeawayRef}
            afterFetchBullets={() => setFetchBullets(true)}
            updatePaperState={updatePaperState}
            paper={paper}
            userVoteChecked={userVoteChecked}
            fetchBullets={fetchBullets}
            loadingPaper={loadingPaper}
          /> */}
          <SummaryTab
            paperId={paperId}
            paper={paper}
            summary={summary}
            descriptionRef={descriptionRef}
            updatePaperState={updatePaperState}
            updateSummary={setSummary}
            loadingSummary={loadingSummary}
            userVoteChecked={userVoteChecked}
          />
          <a name="comments" id="comments">
            <div id="comments-tab" className={css(styles.space)}>
              <DiscussionTab
                hostname={hostname}
                paperId={paperId}
                paperState={paper}
                calculatedCount={discussionCount}
                setCount={setCount}
                discussionRef={discussionRef}
              />
            </div>
          </a>
          <a name="paper">
            <div id="paper-tab" className={css(styles.paperTabContainer)}>
              <PaperTab
                paperId={paperId}
                paper={paper}
                paperPdfRef={paperPdfRef}
                isModerator={isModerator}
              />
            </div>
          </a>
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
    </div>
  );
};

const fetchPaper = ({ paperId }) => {
  return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      console.log(error);
      Sentry.captureException(error);
    });
};

Paper.getInitialProps = async (ctx) => {
  const { req, store, query, res } = ctx;
  const { host } = absoluteUrl(req);
  const hostname = host;

  if (!isServer()) {
    return {
      hostname,
    };
  }

  // Fetch data from external API
  let props = {};
  let paper;
  let paperSlug;

  try {
    paper = await fetchPaper({ paperId: query.paperId });
  } catch (err) {
    console.log(err);
    Sentry.captureException(err);
    // if paper doesnot exist
    if (res) {
      res.statusCode = 404;
    }
    return { error: true };
  }

  if (!paper) {
    if (res) {
      res.statusCode = 404;
    }
    return { error: true };
  }

  paperSlug = paper.slug;
  let fetchedPaper = true;

  if (paperSlug !== query.paperName) {
    // redirect paper if paperName does not match slug
    let paperName = paperSlug
      ? paperSlug
      : formatPaperSlug(paper.paper_title ? paper.paper_title : paper.title);

    if (paperName === query.paperName) {
      // catch multiple redirect when slug does not exist
      props = { hostname, paper, fetchedPaper };
      return props;
    }
    let redirectPath = `/paper/${paper.id}/${paperName}`;

    res.writeHead(301, { Location: redirectPath });
    res.end();
    props = {
      hostname,
      paper,
      redirectPath,
      paperName,
      paperSlug,
      paperName: query.paperName,
    };
    return props;
  }
  props = { hostname, paper, fetchedPaper };
  return props;
};

const styles = StyleSheet.create({
  componentWrapperStyles: {
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
    backgroundColor: "#FAFAFA",
    minHeight: "100vh",
    position: "relative",
    "@media only screen and (max-width: 415px)": {
      paddingTop: 20,
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
  paperProgress: {
    marginTop: 16,
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
    marginTop: 30,
  },
  stickyComponent: {
    top: 0,
    position: "sticky",
    backgroundColor: "#FFF",
    zIndex: 4,
    "@media only screen and (max-width: 760px)": {
      top: 80,
    },
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
    "@media only screen and (max-width: 767px)": {
      padding: 25,
    },
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
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  icon: {
    fontSize: 50,
    color: "rgb(78, 83, 255)",
    height: 50,
    marginBottom: 25,
  },
  citationEmptySubtext: {
    fontSize: 16,
    color: "rgba(36, 31, 58, 0.8)",
    fontWeight: 400,
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  paperPageContainer: {
    overflowX: "hidden",
    backgroundColor: "#FFF",
  },
  abstractText: {
    lineHeight: 1.6,
  },
  figuresContainer: {
    marginTop: 32,
  },
  limitsContainer: {
    marginTop: 30,
  },
});

const mapStateToProps = (state) => ({
  vote: state.vote,
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  updateUser: AuthActions.updateUser,
  setUploadingPaper: AuthActions.setUploadingPaper,
  getLimitations: LimitationsActions.getLimitations,
  updatePaperState: PaperActions.updatePaperState,
  getThreads: PaperActions.getThreads,
  getBullets: BulletActions.getBullets,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Paper);
