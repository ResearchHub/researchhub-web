import React, { useEffect, useState, useRef, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";

import { connect, useDispatch, useStore } from "react-redux";
import Joyride from "react-joyride";
import Error from "next/error";
import * as Sentry from "@sentry/browser";
import { Waypoint } from "react-waypoint";

// Components
import AuthorStatsDropdown from "~/components/Paper/Tabs/AuthorStatsDropdown";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import InlineCommentThreadsDisplayBarWithMediaSize from "~/components/InlineCommentDisplay/InlineCommentThreadsDisplayBar";
import PaperDraftContainer from "~/components/PaperDraft/PaperDraftContainer";
import PostPageCard from "~/components/PostPageCard";
import PaperSections from "~/components/Paper/SideColumn/PaperSections";
import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperTabBar from "~/components/PaperTabBar";
import PaperBanner from "~/components/Paper/PaperBanner.js";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import TableOfContent from "~/components/PaperDraft/TableOfContent";

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
import helpers from "@quantfive/js-web-config/helpers";
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import VoteActions from "~/redux/vote";
import { LimitationsActions } from "~/redux/limitations";
import { BulletActions } from "~/redux/bullets";

// Config
import { UPVOTE, DOWNVOTE, userVoteToConstant } from "~/config/constants";
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
} from "~/config/utils/editor";
import { getAuthorName } from "~/config/utils";
import * as shims from "~/redux/paper/shims";

const isServer = () => typeof window === "undefined";
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

function useEffectFetchPost({ post, setPost, query }) {
  useEffect(() => {
    fetch(
      API.RESEARCHHUB_POSTS({ post_id: query.documentId }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        setPost(data.results[0]);
      });
  }, [post, query]);
}

const Post = (props) => {
  const router = useRouter();
  if (props.error) {
    return <Error statusCode={404} />;
  }

  if (props.redirectPath && typeof window !== "undefined") {
    // updates the [documentId] without refetching data
    router.replace("/post/[documentId]/[title]", props.redirectPath, {
      shallow: true,
    });
  }

  const dispatch = useDispatch();
  const store = useStore();

  const [post, setPost] = useState(props.post || {});
  useEffectFetchPost({ post: props.post, setPost, query: props.query });

  // const [score, setScore] = useState(getNestedValue(props.paper, ["score"], 0));
  const [flagged, setFlag] = useState(props.paper && props.paper.user_flag);
  // const [selectedVoteType, setSelectedVoteType] = useState(
  //   getVoteType(props.paper && props.paper.userVote)
  // );

  const [discussionCount, setCount] = useState(
    calculateCommentCount(props.post)
  );

  const isModerator = store.getState().auth.user.moderator;
  const isSubmitter =
    post && post.created_by && post.created_by.id === props.auth.user.id;

  useEffect(() => {
    setPost(props.post);
  }, [props.post, props.query]);

  //useEffect(() => {
  //  setCount(calculateCommentCount(post));
  //}, [post.discussionSource]);

  // async function upvote() {
  //   dispatch(VoteActions.postUpvotePending());
  //   await dispatch(VoteActions.postUpvote(paperId));
  //   updateWidgetUI();
  // }

  // async function downvote() {
  //   dispatch(VoteActions.postDownvotePending());
  //   await dispatch(VoteActions.postDownvote(paperId));
  //   updateWidgetUI();
  // }

  const restorePost = () => {
    setPost({ ...post, is_removed: false });
  };

  const removePost = () => {
    setPost({ ...post, is_removed: true });
  };

  function calculateCommentCount(post) {
    let discussionCount = 0;
    if (post) {
      discussionCount = post.discussion_count;
    }
    return discussionCount;
  }

  function formatDescription() {
    const { title } = post;

    if (!post) return "";

    if (post.title) {
      return post.title;
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

  let socialImageUrl = post && post.metatagImage;

  if (!socialImageUrl) {
    socialImageUrl = post && post.preview_img && post.preview_img.file;
  }

  function updatePostState(newState) {
    setPost(newState);
  }

  function getAllAuthors() {
    const { created_by } = post;
    let allAuthors = [];
    if (post.created_by) {
      allAuthors = [created_by.author_profile];
    }
    return allAuthors;
  }

  const slug =
    post && post.title && post.title.toLowerCase().replace(/\s/g, "-");

  if (post) {
    return (
      <div>
        <Head
          title={post.title}
          description={formatDescription()}
          socialImageUrl={socialImageUrl}
          noindex={post.is_removed || post.is_removed_by_user}
          canonical={`https://www.researchhub.com/post/${post.id}/${slug}`}
        />
        <div className={css(styles.root)}>
          <PaperBanner post={post} postType="post" />
          <PaperTransactionModal
            post={post}
            updatePostState={updatePostState}
          />
          <div className={css(styles.container)}>
            <div className={css(styles.main)}>
              <div className={css(styles.paperPageContainer, styles.top)}>
                <PostPageCard
                  post={post}
                  shareUrl={process.browser && window.location.href}
                  isModerator={isModerator}
                  isSubmitter={isSubmitter}
                  removePost={removePost}
                  restorePost={restorePost}
                />
              </div>
              <div className={css(styles.paperMetaContainerMobile)}>
                <AuthorStatsDropdown
                  authors={getAllAuthors()}
                  paper={post}
                  hubs={post.hubs}
                  paperId={post.id}
                />
              </div>
              <div className={css(styles.space)}>
                <a name="comments" />
                <DiscussionTab
                  hostname={props.hostname}
                  documentType={"post"}
                  post={post}
                  postId={post.id}
                  calculatedCount={discussionCount}
                  setCount={setCount}
                  isCollapsible={false}
                />
              </div>
            </div>
            <div className={css(styles.sidebar)}>
              <PaperSideColumn
                authors={getAllAuthors()}
                paper={post}
                hubs={post.hubs}
                paperId={post.id}
                isPost={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

Post.getInitialProps = async (ctx) => {
  const { req, store, query, res } = ctx;
  const { host } = absoluteUrl(req);
  const hostname = host;
  const props = { hostname, query };
  return props;
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
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "flex-start",
    // width: "100%",
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
      marginTop: 16,
      width: "90%",
    },
    "@media only screen and (min-width: 1024px)": {
      width: "100%",
      display: "table",
    },
    "@media only screen and (min-width: 1200px)": {
      width: "90%",
    },
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
)(Post);
