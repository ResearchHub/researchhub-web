import { connect, useDispatch, useStore } from "react-redux";
import { isUserEditorOfHubs } from "~/components/UnifiedDocFeed/utils/getEditorUserIDsFromHubs";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState, Fragment, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { Waypoint } from "react-waypoint";
import * as Sentry from "@sentry/browser";
import Error from "next/error";

// Components
import AuthorStatsDropdown from "~/components/Paper/Tabs/AuthorStatsDropdown";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import InlineCommentThreadsDisplayBarWithMediaSize from "~/components/InlineCommentDisplay/InlineCommentThreadsDisplayBar";
import PaperDraftContainer from "~/components/PaperDraft/PaperDraftContainer";
import PaperPageCard from "~/components/PaperPageCard";
import PaperSections from "~/components/Paper/SideColumn/PaperSections";
import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import PaperBanner from "~/components/Paper/PaperBanner.js";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import TableOfContent from "~/components/PaperDraft/TableOfContent";
import killswitch from "~/config/killswitch/killswitch";
import { isEmpty } from "~/config/utils/nullchecks";

// Dynamic modules
import dynamic from "next/dynamic";
const PaperFeatureModal = dynamic(() =>
  import("~/components/Modals/PaperFeatureModal")
);
const PaperPDFModal = dynamic(() =>
  import("~/components/Modals/PaperPDFModal")
);
const PaperTransactionModal = dynamic(() =>
  import("~/components/Modals/PaperTransactionModal")
);

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import VoteActions from "~/redux/vote";
import { LimitationsActions } from "~/redux/limitations";
import { BulletActions } from "~/redux/bullets";

// Undux
import InlineCommentUnduxStore from "~/components/PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import PaperDraftUnduxStore from "~/components/PaperDraft/undux/PaperDraftUnduxStore";

// Config
import { UPVOTE, DOWNVOTE, userVoteToConstant } from "~/config/constants";
import { absoluteUrl } from "~/config/utils/routing";
import { buildSlug } from "~/config/utils/document";
import { getVoteType } from "~/config/utils/reputation";
import { checkSummaryVote, checkUserVotesOnPapers } from "~/config/fetch";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { getAuthorName, getNestedValue } from "~/config/utils/misc";
import {
  convertToEditorValue,
  convertDeltaToText,
  isQuillDelta,
} from "~/config/utils/editor";
import * as shims from "~/redux/paper/shims";

const steps = [
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
    content: "Add a summary to help others understand what the paper is about.",
    disableBeacon: true,
  },
];

const fetchPaper = (url, config) => {
  return fetch(url, config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      console.log(error);
      Sentry.captureException({ error, url, config });
    });
};

const Paper = ({
  initialPaperData,
  auth,
  redirectPath,
  error,
  isFetchComplete = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();

  if (error) {
    Sentry.captureException({ error, initialPaperData, query: router.query });
    return <Error statusCode={error.code} />;
  }

  // ENUM: NOT_FETCHED, FETCHING, COMPLETED
  const [fetchFreshDataStatus, setFetchFreshDataStatus] =
    useState("NOT_FETCHED");
  const [paper, setPaper] = useState({});

  const [summary, setSummary] = useState((paper && paper.summary) || {});
  const [score, setScore] = useState(undefined);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [flagged, setFlag] = useState(paper && paper.user_flag);
  const [selectedVoteType, setSelectedVoteType] = useState(undefined);
  const [discussionCount, setCount] = useState(null);

  const [paperDraftExists, setPaperDraftExists] = useState(false);
  const [paperDraftSections, setPaperDraftSections] = useState([]); // table of content for paperDraft
  const [activeSection, setActiveSection] = useState(0); // paper draft sections
  const [activeTab, setActiveTab] = useState(0); // sections for paper page
  const [userVoteChecked, setUserVoteChecked] = useState(false);
  const { hubs = [], uploaded_by } = paper;
  const isModerator = store.getState().auth.user.moderator;
  const currUserID = auth?.user?.id ?? null;
  const isSubmitter = uploaded_by && uploaded_by?.id === currUserID;
  const isEditorOfHubs = isUserEditorOfHubs({ currUserID, hubs });
  const commentsRef = useRef(null);

  const structuredDataForSEO = useMemo(
    () => buildStructuredDataForSEO(),
    [paper]
  );

  // Typically, this if statement would be created with a useEffect clause
  // but since useEffect does not work with SSG, we need a standard if statement.
  const noSetPaperData = !isEmpty(initialPaperData) && isEmpty(paper);
  if (noSetPaperData) {
    setPaper(shims.paper(initialPaperData));
    setScore(getNestedValue(initialPaperData, ["score"], 0));

    if (discussionCount === null) {
      setCount(calculateCommentCount(initialPaperData));
    }
  }

  useEffect(() => {
    if (fetchFreshDataStatus === "NOT_FETCHED" && !isEmpty(paper)) {
      fetchFreshData(paper);
    }
  }, [fetchFreshDataStatus, paper]);

  useEffect(() => {
    if (!process.browser) return;

    const idx = window.location.hash.indexOf("#comments");
    if (idx > -1 && commentsRef.current) {
      const elem = commentsRef.current;
      const pos = elem.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: pos,
        behavior: "smooth",
      });
    }
  }, [commentsRef.current]);

  if (killswitch("paperSummary")) {
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
    }, [summary.id, auth.isLoggedIn]);
  }

  function fetchFreshData(paper) {
    setFetchFreshDataStatus("FETCHING");
    fetchPaper(API.PAPER({ paperId: paper.id }), API.GET_CONFIG()).then(
      (freshPaperData) => {
        setFetchFreshDataStatus("COMPLETED");
        setScore(getNestedValue(freshPaperData, ["score"], 0));
        setFlag(freshPaperData.user_flag);

        const updatedPaper = shims.paper({
          ...freshPaperData,
        });

        if (!isEmpty(freshPaperData.user_vote)) {
          setSelectedVoteType(userVoteToConstant(freshPaperData.user_vote));
        }

        setPaper(shims.paper(freshPaperData));
        setUserVoteChecked(true);
      }
    );
  }

  async function upvote() {
    dispatch(VoteActions.postUpvotePending());
    await dispatch(VoteActions.postUpvote(paper.id));
    updateWidgetUI();
  }

  async function downvote() {
    dispatch(VoteActions.postDownvotePending());
    await dispatch(VoteActions.postDownvote(paper.id));
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

  function buildStructuredDataForSEO() {
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
  const inlineCommentUnduxStore = InlineCommentUnduxStore.useStore();
  const shouldShowInlineComments =
    inlineCommentUnduxStore.get("displayableInlineComments").length > 0;

  return (
    <div>
      <PaperBanner
        document={paper}
        documentType="paper"
        loadingPaper={!isFetchComplete}
      />
      <PaperTransactionModal
        paper={paper}
        updatePaperState={updatePaperState}
      />
      <PaperFeatureModal
        paper={paper}
        updatePaperState={updatePaperState}
        updateSummary={setSummary}
      />
      <PaperPDFModal paperId={paper.id} paper={paper} />
      <Head
        title={paper.title}
        description={formatDescription()}
        socialImageUrl={socialImageUrl}
        noindex={paper.is_removed || paper.is_removed_by_user}
        canonical={`${process.env.HOST}/paper/${paper.id}/${paper.slug}`}
      >
        <script
          type="application/ld+json"
          id="structuredData"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataForSEO),
          }}
        ></script>
      </Head>
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
                discussionCount={discussionCount}
                doneFetchingPaper={isFetchComplete}
                downvote={downvote}
                flagged={flagged}
                isEditorOfHubs={isEditorOfHubs}
                isModerator={isModerator}
                isSubmitter={isSubmitter}
                paper={paper}
                paperId={paper.id}
                removePaper={removePaper}
                restorePaper={restorePaper}
                score={score}
                selectedVoteType={selectedVoteType}
                setFlag={setFlag}
                shareUrl={process.browser && window.location.href}
                upvote={upvote}
              />
            </div>
            <div className={css(styles.paperMetaContainerMobile)}>
              <AuthorStatsDropdown
                authors={getAllAuthors()}
                paper={paper}
                hubs={paper.hubs}
                paperId={paper.id}
                isPaper
              />
            </div>
            <div className={css(styles.stickyComponent)}>
              <PaperTabBar
                paperId={paper.id}
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
                <div>
                  <a name="abstract" />
                  <SummaryTab
                    paperId={paper.id}
                    paper={paper}
                    summary={summary}
                    updatePaperState={updatePaperState}
                    updateSummary={setSummary}
                    loadingSummary={loadingSummary}
                    userVoteChecked={userVoteChecked}
                  />
                </div>
              </Waypoint>
            </div>
            {isFetchComplete /* Performance Optimization */ && (
              <Waypoint
                onEnter={() => onSectionEnter(2)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <div className={css(styles.space)}>
                  <a name="comments" ref={commentsRef} />
                  {
                    <DiscussionTab
                      hostname={process.env.HOST}
                      documentType={"paper"}
                      paperId={paper.id}
                      paperState={paper}
                      calculatedCount={discussionCount}
                      setCount={setCount}
                      isCollapsible={false}
                    />
                  }
                </div>
              </Waypoint>
            )}
            <div
              className={css(
                styles.paperPageContainer,
                styles.bottom,
                styles.noMarginLeft,
                !paperDraftExists && styles.hide
              )}
            >
              {isFetchComplete /* Performance Optimization */ && (
                <Waypoint
                  onEnter={() => onSectionEnter(3)}
                  topOffset={40}
                  bottomOffset={"95%"}
                >
                  <div>
                    <a name="paper" />
                    <TableOfContent
                      paperDraftExists={paperDraftExists}
                      paperDraftSections={paperDraftSections}
                    />
                    <PaperDraftContainer
                      isViewerAllowedToEdit={isModerator}
                      paperDraftExists={paperDraftExists}
                      paperDraftSections={paperDraftSections}
                      paperId={paper.id}
                      setActiveSection={setActiveSection}
                      setPaperDraftExists={setPaperDraftExists}
                      setPaperDraftSections={setPaperDraftSections}
                    />
                  </div>
                </Waypoint>
              )}
            </div>
            {isFetchComplete /* Performance Optimization */ && (
              <Waypoint
                onEnter={() => onSectionEnter(4)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <div>
                  <a name="paper pdf" />
                  <div className={css(styles.paperTabContainer)}>
                    <PaperTab
                      paperId={paper.id}
                      paper={paper}
                      isModerator={isModerator}
                    />
                  </div>
                </div>
              </Waypoint>
            )}
          </div>

          <div className={css(styles.sidebar)}>
            {shouldShowInlineComments ? (
              <InlineCommentThreadsDisplayBarWithMediaSize isShown />
            ) : (
              <Fragment>
                <PaperSideColumn
                  authors={getAllAuthors()}
                  paper={paper}
                  hubs={paper.hubs}
                  paperId={paper.id}
                />
                <PaperSections
                  activeTab={activeTab} // for paper page tabs
                  setActiveTab={setActiveTab}
                  activeSection={activeSection} // for paper draft sections
                  setActiveSection={setActiveSection}
                  paperDraftSections={paperDraftSections}
                  paperDraftExists={paperDraftExists}
                />
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaperIndexWithUndux = (props) => {
  return (
    <PaperDraftUnduxStore.Container>
      <InlineCommentUnduxStore.Container>
        <Paper {...props} />
      </InlineCommentUnduxStore.Container>
    </PaperDraftUnduxStore.Container>
  );
};

export async function getStaticPaths(ctx) {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(ctx) {
  let paper;
  const { paperId } = ctx.params;

  try {
    paper = await fetchPaper(API.PAPER({ paperId }), API.GET_CONFIG());
  } catch (err) {
    console.log("err", err);
    return {
      props: {
        error: {
          code: 500,
        },
      },
      revalidate: 5,
    };
  }

  if (!paper) {
    return {
      props: {
        error: {
          code: 404,
        },
      },
      revalidate: 1,
    };
  } else {
    const slugFromQuery = ctx.params.paperName;

    // DANGER ZONE: Be careful when updating this. Could result
    // in an infinite loop that could bring server down.
    if (paper.slug && paper.slug !== slugFromQuery) {
      return {
        redirect: {
          destination: `/paper/${paperId}/${paper.slug}`,
          permanent: true,
        },
      };
    }

    const props = {
      initialPaperData: paper,
      isFetchComplete: true,
    };

    return {
      props,
      // Static page will be regenerated after specified seconds.
      revalidate: 60,
    };
  }
}

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
    marginTop: 30,
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    borderCollapse: "separate",
    borderSpacing: "30px 40px",
    width: 1100,
    justifyContent: "center",
    "@media only screen and (max-width: 767px)": {
      borderSpacing: "0",
      display: "flex",
      flexDirection: "column",
    },
    "@media only screen and (min-width: 768px)": {
      display: "flex",
      marginTop: 16,
    },
    "@media only screen and (min-width: 1024px)": {
      display: "flex",
      margin: "0 auto",
    },
    "@media only screen and (min-width: 1200px)": {},
  },
  desktop: {
    display: "none",
    "@media only screen and (min-width: 1024px)": {
      display: "block",
    },
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
    maxWidth: "initial",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
    "@media only screen and (min-width: 768px)": {
      width: "80%",
      maxWidth: 600,
    },
    "@media only screen and (min-width: 1024px)": {
      width: "unset",
      maxWidth: 700,
      marginRight: 30,
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
      borderRadius: "0px",
      borderTop: "none",
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

// const mapStateToProps = ({ auth }) => ({
//   currUserID: auth?.user?.id ?? null,
//   currUserProfID: auth?.user?.author_profile?.id ?? null,
// });

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
)(PaperIndexWithUndux);
