import { useEffect, useState, useRef, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";
import Joyride from "react-joyride";
import Error from "next/error";
import "./styles/anchor.css";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import FigureTab from "~/components/Paper/Tabs/FigureTab";
import FileTab from "~/components/Paper/Tabs/FileTab";
import PaperPageCard from "~/components/PaperPageCard";
import CitationCard from "~/components/Paper/CitationCard";
import CitationPreviewPlaceholder from "~/components/Placeholders/CitationPreviewPlaceholder";

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

const Paper = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const isModerator = store.getState().auth.user.moderator;
  const [paper, setPaper] = useState(props.paper);
  const [referencedBy, setReferencedBy] = useState([]);
  const [referencedByCount, setReferencedByCount] = useState(0);
  const [loadingReferencedBy, setLoadingReferencedBy] = useState(true);
  const [score, setScore] = useState(getNestedValue(paper, ["score"], 0));
  const [loadingPaper, setLoadingPaper] = useState(true);
  const [loadingFile, setLoadingFile] = useState(true);
  const [flagged, setFlag] = useState(paper.user_flag !== null);
  const [sticky, setSticky] = useState(false);
  const [scrollView, setScrollView] = useState(false);
  const [discussionThreads, setDiscussionThreads] = useState(
    getDiscussionThreads(paper)
  );
  const [selectedVoteType, setSelectedVoteType] = useState(
    getVoteType(paper.userVote.voteType)
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
  const paperTabsRef = useRef(null);
  const keyTakeawayRef = useRef(null);
  const descriptionRef = useRef(null);
  const discussionRef = useRef(null);
  const citationRef = useRef(null);
  const paperPdfRef = useRef(null);

  // useEffect(() => {
  //   window.scroll({ top: 0, behavior: "auto" });
  // }, []);

  const fetchReferences = () => {
    let params = {
      paperId: paperId,
      route: "referenced_by",
    };
    return fetch(API.PAPER(params), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setLoadingReferencedBy(false);
        let newReferencedBy = [...referencedBy, ...res.results];
        setReferencedBy(newReferencedBy);
        setReferencedByCount(res.count);
      });
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  async function refetchPaper() {
    setLoadingPaper(true);
    await dispatch(PaperActions.getPaper(paperId));
    const fetchedPaper = store.getState().paper;
    await dispatch(PaperActions.getThreads(paperId, fetchedPaper));
    const refetchedPaper = store.getState().paper;

    setLoadingPaper(false);
    setPaper(refetchedPaper);
    setSelectedVoteType(getVoteType(refetchedPaper.userVote));
    setDiscussionThreads(getDiscussionThreads(refetchedPaper));
    setFlag(refetchedPaper.user_flag !== null);

    // window.scroll({ top: 0, behavior: "auto" });
    showMessage({ show: false });
    if (props.auth.isLoggedIn && props.auth.user.upload_tutorial_complete) {
      props.setUploadingPaper(false);
    }
  }

  useEffect(() => {
    store.getState().paper.id && setLoadingPaper(false);
  }, [store.getState().paper]);

  useEffect(() => {
    if (store.getState().paper.id !== paperId) {
      refetchPaper();
    }
  }, [paperId]);

  useEffect(() => {
    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
  }, [scrollListener]);

  function getDiscussionThreads(paper) {
    return paper.discussion ? paper.discussion.threads : [];
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
    if (!scrollView && window.scrollY >= 5) {
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
          <Head
            title={paper.title}
            description={paper.tagline}
            socialImageUrl={props.paper.metatagImage}
          />
          <div className={css(styles.paperPageContainer)}>
            <ComponentWrapper overrideStyle={styles.componentWrapper}>
              <PaperPageCard
                paper={paper}
                score={score}
                upvote={upvote}
                downvote={downvote}
                selectedVoteType={selectedVoteType}
                shareUrl={shareUrl}
                isModerator={isModerator}
                flagged={flagged}
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
            />
          </div>
          <div className={css(styles.contentContainer)}>
            <SummaryTab
              paperId={paperId}
              paper={paper}
              keyTakeawayRef={keyTakeawayRef}
              descriptionRef={descriptionRef}
            />
            <a name="discussions">
              <div className={css(styles.space)} />
              <div id="discussions-tab">
                <DiscussionTab
                  hostname={hostname}
                  paperId={paperId}
                  threads={discussionThreads}
                  discussionCount={discussionCount}
                  setCount={setCount}
                  discussionRef={discussionRef}
                />
              </div>
            </a>
            <a name="figures">
              <div className={css(styles.figuresContainer)}>
                <FigureTab paperId={paperId} paper={paper} />
              </div>
            </a>
            <a name="paper">
              <div id="paper-tab" className={css(styles.paperTabContainer)}>
                <PaperTab
                  paperId={paperId}
                  paper={paper}
                  paperPdfRef={paperPdfRef}
                  isModerator={isModerator}
                  setLoadingFile={setLoadingFile}
                />
              </div>
            </a>
            <a name="citations">
              <ComponentWrapper overrideStyle={styles.componentWrapperStyles}>
                <ReactPlaceholder
                  ready={!loadingReferencedBy}
                  showLoadingAnimation
                  customPlaceholder={
                    <CitationPreviewPlaceholder color="#efefef" />
                  }
                >
                  <div
                    className={css(styles.citationContainer)}
                    ref={citationRef}
                    id="citedby-tab"
                  >
                    <div className={css(styles.header)}>
                      <div className={css(styles.citationTitle)}>Cited By</div>
                      <span className={css(styles.citationCount)}>
                        {referencedByCount > 0 && referencedByCount}
                      </span>
                    </div>
                    <div className={css(styles.citations)}>
                      {referencedBy.length > 0 ? (
                        referencedBy.map((reference, id) => {
                          return (
                            <CitationCard
                              key={`citation-${reference.id}-${id}`}
                              citation={reference}
                            />
                          );
                        })
                      ) : (
                        <div className={css(styles.citationEmpty)}>
                          <div className={css(styles.icon)}>
                            <i className="fad fa-file-alt" />
                          </div>
                          This paper has not been cited yet
                          <div className={css(styles.citationEmptySubtext)}>
                            No citations have been found in RH papers
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ReactPlaceholder>
              </ComponentWrapper>
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
      )}
    </div>
  );
};

Paper.getInitialProps = async ({ isServer, req, store, query }) => {
  const { host } = absoluteUrl(req);
  const hostname = host;
  var fetchedPaper;
  if (
    (store.getState().paper.id !== query.paperId &&
      store.getState().paper.doneFetchingPaper) ||
    (!store.getState().paper.doneFetchingPaper && !store.getState().paper.id)
  ) {
    await store.dispatch(PaperActions.getPaper(query.paperId));
    fetchedPaper = store.getState().paper;
    await store.dispatch(PaperActions.getThreads(query.paperId, fetchedPaper));
  }
  return { isServer, hostname, paper: fetchedPaper };
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
  },
  abstractText: {
    lineHeight: 1.6,
  },
  figuresContainer: {
    marginTop: 32,
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
