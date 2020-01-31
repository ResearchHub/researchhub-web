import { useEffect, useState, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Router, { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";
import Joyride from "react-joyride";
import Error from "next/error";

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
import FlagButton from "~/components/FlagButton";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";
import VoteActions from "~/redux/vote";
import { FlagActions } from "~/redux/flags";

// Config
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import icons from "~/config/themes/icons";
import { absoluteUrl, getNestedValue, getVoteType } from "~/config/utils";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { formatPublishedDate } from "~/config/utils";

const Paper = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const [paper, setPaper] = useState(props.paper);
  const [score, setScore] = useState(getNestedValue(paper, ["score"], 0));
  const [flagged, setFlag] = useState(paper.user_flag !== null);
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

  const { hostname, showMessage } = props;
  const { paperId, tabName } = router.query;
  const shareUrl = hostname + "/paper/" + paperId;

  const paperTitle = getNestedValue(paper, ["title"], "");
  const threadCount = getNestedValue(paper, ["discussion", "count"], 0);

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

  function getDiscussionThreads(paper) {
    return paper.discussion.threads;
    // return getNestedValue(paper, ["discussion", "threads"]);
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

  function renderPublishDate() {
    if (paper.paper_publish_date) {
      return (
        <div className={css(styles.info)}>
          {formatPublishedDate(moment(paper.paper_publish_date))}
        </div>
      );
    }
  }

  function navigateToEditPaperInfo() {
    let href = "/paper/upload/info/[paperId]";
    let as = `/paper/upload/info/${paperId}`;
    Router.push(href, as);
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

  return (
    <div className={css(styles.container)}>
      {paper.status === 404 ? (
        <Error statusCode={paper.status} />
      ) : (
        <Fragment>
          <Head title={paper.title} description={paper.tagline} />
          <ComponentWrapper overrideStyle={styles.componentWrapper}>
            <div className={css(styles.header)}>
              <div className={css(styles.voting)}>
                <VoteWidget
                  score={score}
                  onUpvote={upvote}
                  onDownvote={downvote}
                  selected={selectedVoteType}
                  isPaper={true}
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
                      isPaper={true}
                    />
                  </div>
                  <div className={css(styles.actionButtons)}>
                    <PermissionNotificationWrapper
                      modalMessage="edit papers"
                      onClick={navigateToEditPaperInfo}
                      permissionKey="UpdatePaper"
                      loginRequired={true}
                      styling={styles.actionButton}
                    >
                      <ActionButton
                        className={"first-step"}
                        icon={"fas fa-pencil"}
                      />
                    </PermissionNotificationWrapper>
                    <ShareAction
                      iconNode={icons.shareAlt}
                      addRipples={true}
                      title={"Share this paper"}
                      subtitle={paperTitle}
                      url={shareUrl}
                    />
                    {/*<ActionButton
                        icon={"fas fa-bookmark"}
                        action={null}
                        addRipples={true}
                      />*/}
                    <FlagButton
                      paperId={paper.id}
                      flagged={flagged}
                      setFlag={setFlag}
                    />
                  </div>
                </span>
              </div>
              <div className={css(styles.mobileInfoSection)}>
                {renderPublishDate()}
              </div>
              <div className={css(styles.tags)}>
                <div
                  className={css(
                    styles.authors,
                    paper.authors.length < 1 && styles.hide
                  )}
                >
                  {renderAuthors()}
                </div>
                <div className={css(styles.hubs)}>{renderHubs()}</div>
              </div>
              <div className={css(styles.tagline)}>
                {paper && paper.tagline}
              </div>
              <div className={css(styles.mobileDoi)}>
                {paper.doi && (
                  <div className={css(styles.info)}>
                    DOI: {paper && paper.doi}
                  </div>
                )}
              </div>
              <div className={css(styles.infoSection)}>
                {renderPublishDate()}
                {paper.doi && (
                  <div className={css(styles.info)}>
                    DOI: {paper && paper.doi}
                  </div>
                )}
              </div>
              <div className={css(styles.mobileTags)}>
                <div className={css(styles.authors)}>{renderAuthors()}</div>
                <div className={css(styles.hubs)}>{renderHubs()}</div>
                <PermissionNotificationWrapper>
                  <ActionButton
                    className={"first-step"}
                    icon={"fas fa-pencil"}
                  />
                </PermissionNotificationWrapper>
                <ShareAction
                  iconNode={icons.shareAlt}
                  addRipples={true}
                  title={"Share this paper"}
                  subtitle={paperTitle}
                  url={shareUrl}
                />
                <FlagButton
                  paperId={paper.id}
                  flagged={flagged}
                  setFlag={setFlag}
                />
                {/* <ActionButton
                  icon={"fas fa-bookmark"}
                  action={null}
                  addRipples={true}
                /> */}
              </div>
            </div>
          </ComponentWrapper>
          <PaperTabBar
            baseUrl={paperId}
            selectedTab={tabName}
            threadCount={threadCount}
          />
          <div className={css(styles.contentContainer)}>
            {renderTabContent()}
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
