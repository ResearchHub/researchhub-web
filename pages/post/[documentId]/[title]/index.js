import API from "~/config/api";
import AuthorStatsDropdown from "~/components/Paper/Tabs/AuthorStatsDropdown";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Error from "next/error";
import Head from "~/components/Head";
import PaperBanner from "~/components/Paper/PaperBanner.js";
import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";
import PostPageCard from "~/components/PostPageCard";
import Script from "next/script";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import { AuthActions } from "~/redux/auth";
import { BulletActions } from "~/redux/bullets";
import { Helpers } from "@quantfive/js-web-config";
import { LimitationsActions } from "~/redux/limitations";
import { MessageActions } from "~/redux/message";
import { PaperActions } from "~/redux/paper";
import { StyleSheet, css } from "aphrodite";
import { absoluteUrl } from "~/config/utils/routing";
import { connect, useStore } from "react-redux";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { isUserEditorOfHubs } from "~/components/UnifiedDocFeed/utils/getEditorUserIDsFromHubs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PaperTransactionModal = dynamic(() =>
  import("~/components/Modals/PaperTransactionModal")
);

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

  const store = useStore();

  const [post, setPost] = useState(props.post || {});
  useEffectFetchPost({ post: props.post, setPost, query: props.query });

  const [flagged, setFlag] = useState(props.paper && props.paper.user_flag);

  const [discussionCount, setCount] = useState(
    calculateCommentCount(props.post)
  );

  const isModerator = store.getState().auth.user.moderator;
  const isSubmitter =
    post && post.created_by && post.created_by.id === props.auth.user.id;

  useEffect(() => {
    setPost(props.post);
  }, [props.post, props.query]);

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
    if (title) {
      return title;
    }
    return "";
  }

  let socialImageUrl = post && post.metatagImage;

  if (!socialImageUrl) {
    socialImageUrl = post && post.preview_img && post.preview_img.file;
  }

  function updatePostState(newState) {
    setPost(newState);
  }

  function getCreatedByAuthor() {
    const { created_by } = post;
    let authors = [];
    if (post.created_by) {
      authors = [created_by.author_profile];
    }
    return authors;
  }

  const slug =
    post && post.title && post.title.toLowerCase().replace(/\s/g, "-");
  const currUserID = props.user?.id ?? null;
  const isEditorOfHubs = isUserEditorOfHubs({
    currUserID,
    hubs: post?.hubs ?? [],
  });

  return !isNullOrUndefined(post) && Object.keys(post).length > 0 ? (
    <div>
      <Head
        title={post.title}
        description={formatDescription()}
        socialImageUrl={socialImageUrl}
        noindex={post.is_removed || post.is_removed_by_user}
        canonical={`https://www.researchhub.com/post/${post.id}/${slug}`}
      />
      <div className={css(styles.root)}>
        <PaperBanner document={post} documentType="post" />
        <PaperTransactionModal post={post} updatePostState={updatePostState} />
        <div className={css(styles.container)}>
          <div className={css(styles.main)}>
            <div className={css(styles.paperPageContainer, styles.top)}>
              <PostPageCard
                isEditorOfHubs={isEditorOfHubs}
                isModerator={isModerator}
                isSubmitter={isSubmitter}
                post={post}
                removePost={removePost}
                restorePost={restorePost}
                shareUrl={process.browser && window.location.href}
              />
            </div>
            <div className={css(styles.paperMetaContainerMobile)}>
              <AuthorStatsDropdown
                authors={
                  post.authors.length > 0 ? post.authors : getCreatedByAuthor()
                }
                paper={post}
                hubs={post.hubs}
                paperId={post.id}
              />
            </div>
            <div className={css(styles.space)}>
              <a name="comments" id="comments" />
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
              authors={
                post.authors.length > 0 ? post.authors : getCreatedByAuthor()
              }
              paper={post}
              hubs={post.hubs}
              paperId={post.id}
              isPost={true}
            />
          </div>
        </div>
      </div>
      <Script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/contrib/mhchem.min.js"
        strategy="lazyOnload" // this script needs to load after the main katex script
      />
    </div>
  ) : null;
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

export default connect(mapStateToProps, mapDispatchToProps)(Post);
