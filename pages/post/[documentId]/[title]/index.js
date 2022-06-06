import API from "~/config/api";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Error from "next/error";
import Head from "~/components/Head";
import PaperBanner from "~/components/Paper/PaperBanner.js";
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
import { breakpoints } from "~/config/themes/screen";
import { Post as PostDoc } from "~/config/types/post";

const PaperTransactionModal = dynamic(() =>
  import("~/components/Modals/PaperTransactionModal")
);

function useEffectFetchPost({ setPost, setPostV2, query }) {
  useEffect(() => {
    fetch(
      API.RESEARCHHUB_POSTS({ post_id: query.documentId }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        const rawPost = data.results[0];
        setPost(rawPost);
        setPostV2(new PostDoc(rawPost));
      });
  }, [query]);
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

  const [post, setPost] = useState({});
  const [postV2, setPostV2] = useState(new PostDoc({}));
  const [discussionCount, setCount] = useState(0);

  useEffectFetchPost({ setPost, setPostV2, query: props.query });

  useEffect(() => {
    if (post?.id) {
      setCount(post.discussion_count);
    }
  }, [post]);

  const isModerator = store.getState().auth.user.moderator;
  const isSubmitter =
    post && post.created_by && post.created_by.id === props.auth.user.id;

  const restorePost = () => {
    setPost({ ...post, is_removed: false });
  };

  const removePost = () => {
    setPost({ ...post, is_removed: true });
  };

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
            {postV2 && (
              <PostPageCard
                isEditorOfHubs={isEditorOfHubs}
                isModerator={isModerator}
                isSubmitter={isSubmitter}
                post={postV2}
                removePost={removePost}
                restorePost={restorePost}
                shareUrl={process.browser && window.location.href}
              />
            )}
            <div className={css(styles.section)}>
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
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  container: {
    marginTop: 30,
    marginBottom: 30,
  },
  main: {
    boxSizing: "border-box",
    width: 800,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
      paddingLeft: 25,
      paddingRight: 25,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  section: {
    marginTop: 25,
    paddingTop: 25,
    borderTop: `1px solid ${colors.GREY_LINE()}`,
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
