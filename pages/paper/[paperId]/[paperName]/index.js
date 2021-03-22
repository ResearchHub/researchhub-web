import { useEffect, useState, useRef, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";

import { connect, useDispatch, useStore } from "react-redux";
import Joyride from "react-joyride";
import Error from "next/error";
import "./styles/anchor.css";
import * as Sentry from "@sentry/browser";
import { Waypoint } from "react-waypoint";

// Components
import AuthorStatsDropdown from "~/components/Paper/Tabs/AuthorStatsDropdown";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import InlineCommentThreadsDisplayBar from "~/components/InlineCommentDisplay/InlineCommentThreadsDisplayBar";
import PaperDraftContainer from "~/components/PaperDraft/PaperDraftContainer";
import PaperFeatureModal from "~/components/Modals/PaperFeatureModal";
import PaperPageCard from "~/components/PaperPageCard";
import PaperPreview from "~/components/Paper/SideColumn/PaperPreview";
import PaperSections from "~/components/Paper/SideColumn/PaperSections";
import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import PaperTransactionModal from "~/components/Modals/PaperTransactionModal";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import TableOfContent from "~/components/PaperDraft/TableOfContent";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import VoteActions from "~/redux/vote";
import { LimitationsActions } from "~/redux/limitations";
import { BulletActions } from "~/redux/bullets";

// Undux
import InlineCommentUnduxStore from "~/components/PaperDraftInlineComment/undux/InlineCommentUnduxStore";

// Config
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import {
  absoluteUrl,
  getNestedValue,
  getVoteType,
  formatPaperSlug,
} from "~/config/utils";
import { checkSummaryVote, checkUserVotesOnPapers } from "~/config/fetch";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import {
  convertToEditorValue,
  convertDeltaToText,
  isQuillDelta,
  getAuthorName,
} from "~/config/utils/";
import * as shims from "~/redux/paper/shims";
import React from "react";

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

  const [loadingPaper, setLoadingPaper] = useState(!props.fetchedPaper);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [flagged, setFlag] = useState(props.paper && props.paper.user_flag);
  const [selectedVoteType, setSelectedVoteType] = useState(
    getVoteType(props.paper && props.paper.userVote)
  );
  const [discussionCount, setCount] = useState(
    calculateCommentCount(props.paper)
  );

  const [paperDraftExists, setPaperDraftExists] = useState(false);
  const [paperDraftSections, setPaperDraftSections] = useState([]); // table of content for paperDraft
  const [activeSection, setActiveSection] = useState(0); // paper draft sections
  const [activeTab, setActiveTab] = useState(0); // sections for paper page

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
  const [userVoteChecked, setUserVoteChecked] = useState(false);

  const { hostname } = props;
  const { paperId } = router.query;

  const isModerator = store.getState().auth.user.moderator;
  const isSubmitter =
    paper.uploaded_by && paper.uploaded_by.id === props.auth.user.id;

  let summaryVoteChecked = false;

  useEffect(() => {
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

  useEffect(() => {
    setPaper(props.paper ? shims.paper(props.paper) : {});
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
    setCount(calculateCommentCount(paper));
  }, [paper.discussionSource]);

  function fetchPaper({ paperId }) {
    setLoadingPaper(true);
    return fetch(API.PAPER({ paperId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        setLoadingPaper(false);
        const currPaper = shims.paper(resp);
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
  }

  function checkUserVote(paperState = paper) {
    if (props.auth.isLoggedIn && props.auth.user) {
      return checkUserVotesOnPapers({ paperIds: [paperId] }).then(
        (userVotes) => {
          const userVote = userVotes[paperId];

          if (userVote) {
            const { bullet_low_quality, summary_low_quality } = userVote;

            const updatedPaper = {
              ...paperState,
              bullet_low_quality,
              summary_low_quality,
              userVote: userVote,
            };

            setPaper(updatedPaper);
            setSelectedVoteType(updatedPaper.userVote.vote_type);
          }
          return setUserVoteChecked(true);
        }
      );
    }
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
    setPaper({ ...paper, is_removed: false });
  };

  const removePaper = () => {
    setPaper({ ...paper, is_removed: true });
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

  function calculateCommentCount(paper) {
    let discussionCount = 0;
    if (paper) {
      discussionCount = paper.discussion_count;
    }
    return discussionCount;
  }

  function formatDescription() {
    const { abstract, tagline } = paper;

    if (!paper) return "";

    if (paper.summary) {
      const { summary, summary_plain_text } = paper.summary;

      if (summary_plain_text) {
        return summary_plain_text;
      }

      if (summary) {
        return isQuillDelta(summary)
          ? convertDeltaToText(summary)
          : convertToEditorValue(summary).document.text;
      }
    }

    if (abstract) {
      return abstract;
    }

    if (tagline) {
      return tagline;
    }

    return "";
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

  function getAllAuthors() {
    const { authors, raw_authors } = paper;
    const seen = {};

    const allAuthors = [];

    if (authors && authors.length) {
      authors.forEach((author) => {
        seen[getAuthorName(author)] = true;
        allAuthors.push(author);
      });
    }

    if (raw_authors && raw_authors.length) {
      raw_authors.forEach((author) => {
        if (!seen[getAuthorName(author)]) {
          seen[getAuthorName(author)] = true;
          allAuthors.push(author);
        }
      });
    }

    return allAuthors;
  }

  function onSectionEnter(index) {
    activeTab !== index && setActiveTab(index);
  }

  const shouldShowInlineComment = true; // TODO: calvinhlee - comeup with a design decision
  return (
    <div>
      <PaperTransactionModal
        paper={paper}
        updatePaperState={updatePaperState}
      />
      <PaperFeatureModal
        paper={paper}
        updatePaperState={updatePaperState}
        updateSummary={setSummary}
      />
      <Head
        title={paper.title}
        description={formatDescription()}
        socialImageUrl={socialImageUrl}
        noindex={paper.is_removed || paper.is_removed_by_user}
        canonical={`https://www.researchhub.com/paper/${paper.id}/${paper.slug}`}
      />
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
      <div className={css(styles.root)}>
        <Waypoint
          onEnter={() => onSectionEnter(0)}
          topOffset={40}
          bottomOffset={"95%"}
        >
          <a name="main" />
        </Waypoint>
        <div className={css(styles.container)}>
          <div className={css(styles.main)}>
            <div className={css(styles.paperPageContainer, styles.top)}>
              <PaperPageCard
                paper={paper}
                paperId={paperId}
                score={score}
                upvote={upvote}
                downvote={downvote}
                selectedVoteType={selectedVoteType}
                discussionCount={discussionCount}
                shareUrl={process.browser && window.location.href}
                isModerator={isModerator}
                isSubmitter={isSubmitter}
                flagged={flagged}
                restorePaper={restorePaper}
                removePaper={removePaper}
                doneFetchingPaper={!loadingPaper}
                setFlag={setFlag}
              />
            </div>
            <div className={css(styles.paperMetaContainerMobile)}>
              <AuthorStatsDropdown
                authors={getAllAuthors()}
                paper={paper}
                hubs={paper.hubs}
                paperId={paperId}
              />
            </div>
            <div className={css(styles.stickyComponent)}>
              <PaperTabBar
                paperId={paperId}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                paperDraftSections={paperDraftSections}
                paperDraftExists={paperDraftExists}
              />
            </div>
            <div
              className={css(styles.paperPageContainer, styles.noMarginLeft)}
            >
              <Waypoint
                onEnter={() => onSectionEnter(1)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <a name="abstract">
                  <SummaryTab
                    paperId={paperId}
                    paper={paper}
                    summary={summary}
                    updatePaperState={updatePaperState}
                    updateSummary={setSummary}
                    loadingSummary={loadingSummary}
                    userVoteChecked={userVoteChecked}
                  />
                </a>
              </Waypoint>
            </div>
            <div
              className={css(
                styles.paperPageContainer,
                styles.bottom,
                styles.noMarginLeft,
                !paperDraftExists && styles.hide
              )}
            >
              <Waypoint
                onEnter={() => onSectionEnter(2)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <a name="paper">
                  <TableOfContent
                    paperDraftExists={paperDraftExists}
                    paperDraftSections={paperDraftSections}
                  />
                  <PaperDraftContainer
                    isViewerAllowedToEdit={isModerator}
                    paperDraftExists={paperDraftExists}
                    paperDraftSections={paperDraftSections}
                    paperId={paperId}
                    setActiveSection={setActiveSection}
                    setPaperDraftExists={setPaperDraftExists}
                    setPaperDraftSections={setPaperDraftSections}
                  />
                </a>
              </Waypoint>
            </div>
            <Waypoint
              onEnter={() => onSectionEnter(3)}
              topOffset={40}
              bottomOffset={"95%"}
            >
              <a name="discussion">
                <div className={css(styles.space)}>
                  <DiscussionTab
                    hostname={hostname}
                    paperId={paperId}
                    paperState={paper}
                    calculatedCount={discussionCount}
                    setCount={setCount}
                  />
                </div>
              </a>
            </Waypoint>
            <Waypoint
              onEnter={() => onSectionEnter(4)}
              topOffset={40}
              bottomOffset={"95%"}
            >
              <a name="paper pdf">
                <div className={css(styles.paperTabContainer)}>
                  <PaperTab
                    paperId={paperId}
                    paper={paper}
                    isModerator={isModerator}
                  />
                </div>
              </a>
            </Waypoint>
          </div>
          <div className={css(styles.sidebar)}>
            {shouldShowInlineComment ? (
              <div className={css(styles.inlineSticky)}>
                <InlineCommentThreadsDisplayBar />
              </div>
            ) : (
              <React.Fragment>
                <PaperPreview paper={paper} paperId={paperId} />

                <PaperSideColumn
                  authors={getAllAuthors()}
                  paper={paper}
                  hubs={paper.hubs}
                  paperId={paperId}
                />
                <PaperSections
                  activeTab={activeTab} // for paper page tabs
                  setActiveTab={setActiveTab}
                  activeSection={activeSection} // for paper draft sections
                  setActiveSection={setActiveSection}
                  paperDraftSections={paperDraftSections}
                  paperDraftExists={paperDraftExists}
                />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
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

const PaperWithInlineUndux = (props) => {
  return (
    <InlineCommentUnduxStore.Container>
      <Paper {...props} />
    </InlineCommentUnduxStore.Container>
  );
};

const styles = StyleSheet.create({
  componentWrapperStyles: {
    width: "100%",
    paddingLeft: 0,
    paddingRight: 0,
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    borderCollapse: "separate",
    borderSpacing: "30px 40px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      borderSpacing: "0",
      display: "flex",
      flexDirection: "column",
    },
    "@media only screen and (min-width: 768px)": {
      display: "flex",
    },
    "@media only screen and (min-width: 1024px)": {
      width: "80%",
      display: "table",
    },
  },
  inlineSticky: {
    position: "sticky",
    top: 40,
  },
  sidebar: {
    display: "table-cell",
    boxSizing: "border-box",
    verticalAlign: "top",
    position: "relative",
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
    "@media only screen and (min-width: 768px)": {
      width: "20%",
      marginLeft: 16,
    },
    "@media only screen and (min-width: 1024px)": {
      minWidth: 250,
      maxWidth: 280,
      width: 280,
      marginLeft: 0,
    },
  },
  main: {
    display: "table-cell",
    boxSizing: "border-box",
    position: "relative",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
    "@media only screen and (min-width: 768px)": {
      width: "80%",
    },
    "@media only screen and (min-width: 1024px)": {
      width: "unset",
      maxWidth: 900,
    },
  },
  contentContainer: {
    padding: "30px 0px",
    margin: "auto",
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
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
      marginRight: 21,
    },
  },
  authorContainer: {
    marginRight: 5,
  },
  tags: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
      marginTop: 20,
      marginBottom: 20,
    },
  },
  voting: {
    position: "absolute",
    width: 70,
    left: -80,
    top: 18,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobileVoting: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
  },
  paperProgress: {
    marginTop: 16,
  },
  mobileRow: {
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      justifyContent: "space-between",
      alignContent: "center",
      width: "100%",
    },
  },
  mobileInfoSection: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      marginTop: 17,
      marginBottom: 20,
      fontSize: 14,
    },
  },
  mobileDoi: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      opacity: 0.5,
      fontSize: 14,
    },
  },
  mobileTags: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
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
    "@media only screen and (max-width: 767px)": {
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
  paperMetaContainerMobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
    },
  },
  stickyComponent: {
    display: "none",
    height: 0,
    "@media only screen and (max-width: 767px)": {
      // top: 65,
      top: -2,
      position: "sticky",
      backgroundColor: "#FFF",
      zIndex: 3,
      display: "flex",
      height: "unset",
      width: "100%",
      boxSizing: "border-box",
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
    display: "flex",
    flexDirection: "column",
    border: "1.5px solid #F0F0F0",
    backgroundColor: "#fff",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    padding: "20px 30px 30px 90px",
    boxSizing: "border-box",
    borderRadius: 4,
    "@media only screen and (max-width: 767px)": {
      padding: 20,
      width: "100%",
    },
  },
  noMarginLeft: {
    padding: 30,
    marginTop: 30,
  },
  top: {
    // paddingBottom: 0,
    minHeight: 208,
    "@media only screen and (max-width: 767px)": {
      borderBottom: "none",
    },
  },
  bottom: {
    // borderTop: "none",
    paddingTop: 0,
  },
  componentWrapper: {
    width: 1200,
    boxSizing: "border-box",
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
  user: state.auth.user,
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
)(PaperWithInlineUndux);
