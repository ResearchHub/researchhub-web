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
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { sendAmpEvent } from "~/config/fetch";
import { trackEvent } from "~/config/utils/analytics";

const PaperTransactionModal = dynamic(() =>
  import("~/components/Modals/PaperTransactionModal")
);

const fetchPost = ({ postId }) => {
  return fetch(API.RESEARCHHUB_POST({ post_id: postId }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

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
  const initialPost = props?.initialPost || {};

  const currentUser = getCurrentUser();
  const [post, setPost] = useState(initialPost);
  const [postV2, setPostV2] = useState(new PostDoc(initialPost));
  const [discussionCount, setCount] = useState(0);
  const [bounties, setBounties] = useState(null);
  const [hasBounties, setHasBounties] = useState(false);
  const [allBounties, setAllBounties] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const _initialPost = props?.initialPost;
    if (_initialPost) {
      setPost(_initialPost);
      const formattedPost = new PostDoc(_initialPost);
      setPostV2(formattedPost);
    }
  }, [props]);

  useEffect(() => {
    if (postV2.isReady) {
      setBounties(postV2.bounties);
    }
  }, [postV2]);

  useEffect(() => {
    if (post?.id) {
      setCount(post.discussion_count);
      let hasBounties = post.bounties.length;

      hasBounties &&
        post.bounties.forEach((bounty) => {
          if (bounty.status !== "OPEN") {
            hasBounties = false;
          }
        });
      setHasBounties(hasBounties);
    }
  }, [post]);

  const onBountyCancelled = (bountiesCancelled) => {
    const bountyMap = {};
    bounties.forEach((bounty) => {
      bountyMap[bounty.id] = bounty;
    });

    bountiesCancelled.forEach((bounty) => {
      if (bountyMap[bounty.id]) {
        bountyMap[bounty.id] = null;
      }
    });

    const newBounties = bounties.filter((bounty) => {
      return !!bountyMap[bounty.id];
    });

    setBounties(newBounties);
  };

  const sendBountyAwardAmpEvent = ({ currentUser, bounty }) => {
    trackEvent({
      eventType: "award_bounty",
      vendor: "amp",
      user: currentUser,
      insertId: `award_bounty_${bounty?.id}`,
      data: {
        interaction: "Bounty awarded",
        amount: bounty?.amount,
      },
    });
  };

  const handleAwardBounty = ({
    objectId,
    recipientUserName,
    recipientUserId,
    contentType,
  }) => {
    if (
      bounty &&
      confirm(
        `Award ${formatBountyAmount({
          amount: bounty.amount,
        })} to ${recipientUserName}?`
      )
    ) {
      Bounty.awardAPI({
        bountyId: bounty.id,
        recipientUserId,
        objectId,
        contentType,
      })
        .then((bounty) => {
          props.setMessage("Bounty awarded successfully");
          props.showMessage({ show: true, error: false });

          setBounties(null);

          var event = new CustomEvent("bounty-awarded", {
            detail: { objectId, contentType, amount: bounty.amount },
          });
          document.dispatchEvent(event);
          sendBountyAwardAmpEvent({ currentUser, bounty });
        })
        .catch((err) => {
          props.setMessage("Failed to award bounty");
          props.showMessage({ show: true, error: true });
        });
    }
  };

  const isModerator = store.getState().auth.user.moderator;
  const isSubmitter =
    post && post.created_by && post.created_by.id === props.auth.user.id;

  const restorePost = () => {
    setPost({ ...post, is_removed: false });
    postV2.unifiedDocument.isRemoved = false;
    setPostV2(postV2);
  };

  const removePost = () => {
    setPost({ ...post, is_removed: true });
    postV2.unifiedDocument.isRemoved = true;
    setPostV2(postV2);
  };

  function formatDescription() {
    const { renderable_text } = post;

    if (renderable_text) {
      return renderable_text;
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
      <PaperBanner document={post} documentType="post" />
      <div className={css(styles.postPageRoot)}>
        <PaperTransactionModal post={post} updatePostState={updatePostState} />
        <div className={css(styles.postPageContainer)}>
          <div className={css(styles.postPageMain)}>
            {process.browser && (
              <PostPageCard
                isEditorOfHubs={isEditorOfHubs}
                isModerator={isModerator}
                isSubmitter={isSubmitter}
                post={postV2}
                setHasBounties={setHasBounties}
                removePost={removePost}
                restorePost={restorePost}
                setBounties={setBounties}
                threads={threads}
                hasBounties={hasBounties}
                bounties={bounties}
                allBounties={allBounties}
                onBountyCancelled={onBountyCancelled}
                shareUrl={process.browser && window.location.href}
              />
            )}
            <div className={css(styles.postPageSection)}>
              <a name="comments" id="comments" />
              {postV2.isReady && (
                <DiscussionTab
                  hostname={process.env.HOST}
                  documentType={postV2.unifiedDocument.documentType}
                  post={post}
                  bountyType={postV2.unifiedDocument.documentType}
                  setHasBounties={setHasBounties}
                  setThreadProp={(_threads) => {
                    setThreads(_threads);
                  }}
                  setAllBounties={setAllBounties}
                  postId={post.id}
                  showBountyBtn={true}
                  calculatedCount={discussionCount}
                  setCount={setCount}
                  isCollapsible={false}
                  bounties={bounties || post.bounties}
                  handleAwardBounty={handleAwardBounty}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/contrib/mhchem.min.js"
        strategy="lazyOnload" // this script needs to load after the postPageMain katex script
      />
    </div>
  ) : null;
};

export async function getStaticPaths(ctx) {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  let post;
  const { documentId } = ctx.params;

  try {
    const resp = await fetchPost({ postId: documentId });
    post = resp.results[0];
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

  if (!post) {
    return {
      props: {
        error: {
          code: 404,
        },
      },
      revalidate: 1,
    };
  } else {
    const slugFromQuery = ctx.params.title;

    // DANGER ZONE: Be careful when updating this. Could result
    // in an infinite loop that could bring server down.
    if (post.slug && post.slug !== slugFromQuery) {
      return {
        redirect: {
          destination: `/post/${documentId}/${post.slug}`,
          permanent: true,
        },
      };
    }

    const props = {
      initialPost: post,
      isFetchComplete: true,
    };

    return {
      props,
      // Static page will be regenerated after specified seconds.
      revalidate: 60 * 10,
    };
  }
}

const styles = StyleSheet.create({
  postPageRoot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  postPageContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  postPageMain: {
    boxSizing: "border-box",
    width: 800,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
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
  postPageSection: {
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
  setMessage: MessageActions.setMessage,
  updateUser: AuthActions.updateUser,
  setUploadingPaper: AuthActions.setUploadingPaper,
  getLimitations: LimitationsActions.getLimitations,
  updatePaperState: PaperActions.updatePaperState,
  getThreads: PaperActions.getThreads,
  getBullets: BulletActions.getBullets,
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
