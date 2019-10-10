import { Fragment, useEffect, useState } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { connect, useDispatch, useStore } from "react-redux";

// Components
import ActionButton from "~/components/ActionButton";
import DiscussionCard from "~/components/DiscussionCard";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import ShareModal from "~/components/ShareModal";
import VoteWidget from "~/components/VoteWidget";

// Redux
import DiscussionActions from "~/redux/discussion";

// Utils
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import colors, { discussionPageColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { getNestedValue } from "~/config/utils";

const Thread = (props) => {
  const { hostname, title, body, username, date, score, vote } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const currentUrl = hostname + router.asPath;
  const { paperId, discussionThreadId } = router.query;
  const [selectedVoteType, setSelectedVoteType] = useState(
    vote && vote.voteType
  );

  async function upvote() {
    dispatch(DiscussionActions.postUpvotePending());
    await dispatch(DiscussionActions.postUpvote(paperId, discussionThreadId));
    updateWidgetUI();
  }

  async function downvote() {
    dispatch(DiscussionActions.postDownvotePending());
    await dispatch(DiscussionActions.postDownvote(paperId, discussionThreadId));
    updateWidgetUI();
  }

  function updateWidgetUI() {
    const voteResult = store.getState().discussion.voteResult;
    const vote = getNestedValue(voteResult, ["vote"], false);

    if (vote) {
      const voteType = vote.voteType;
      if (voteType === UPVOTE) {
        setSelectedVoteType(UPVOTE);
      } else if (voteType === DOWNVOTE) {
        setSelectedVoteType(DOWNVOTE);
      }
    }
  }

  return (
    <div>
      <BackButton />
      <DiscussionCard
        top={
          <Fragment>
            <VoteWidget
              selected={selectedVoteType}
              styles={styles.voteWidget}
              score={score}
              fontSize={"16px"}
              width={"58px"}
              onUpvote={upvote}
              onDownvote={downvote}
            />
            <div className={css(styles.threadTitle)}>{title}</div>
            <ShareButton url={currentUrl} />
          </Fragment>
        }
        info={<div className={css(styles.body)}>{body}</div>}
        infoStyle={styles.threadInfo}
        action={<DiscussionPostMetadata username={username} date={date} />}
      />
    </div>
  );
};

const BackButton = () => {
  const message = "Go back to all discussions";
  const router = useRouter();
  const url = getBackUrl(router.asPath);

  function getBackUrl(url) {
    let parts = url.split("/");
    parts.pop();
    parts = parts.join("/");
    return parts;
  }

  return (
    <div className={css(styles.backButtonContainer)}>
      <Link href={"/paper/[paperId]/[tabName]"} as={url}>
        <a className={css(styles.backButton)}>
          {icons.longArrowLeft} {message}
        </a>
      </Link>
    </div>
  );
};

const ShareButton = (props) => {
  const { url } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openShareModal() {
    setModalIsOpen(true);
  }

  function closeShareModal() {
    setModalIsOpen(false);
  }

  return (
    <Fragment>
      <ActionButton action={openShareModal} iconNode={icons.share} />
      <ShareModal
        isOpen={modalIsOpen}
        close={closeShareModal}
        title={"Share this thread"}
        url={url}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingLeft: 68,
  },
  backButton: {
    color: colors.BLACK(0.5),
    textDecoration: "none",
  },
  threadContainer: {
    width: "80%",
    padding: "30px 0px",
    margin: "auto",
  },
  voteWidget: {
    marginRight: 18,
  },
  threadInfo: {
    paddingLeft: 68,
    color: colors.BLACK(0.8),
    "@media only screen and (min-width: 1024px)": {
      width: "calc(100% - 68px - 170px)",
    },
  },
  actionBar: {
    marginTop: 8,
    width: "100%",
  },
  threadTitle: {
    width: "100%",
    fontSize: 33,
  },
  body: {
    marginBottom: 28,
    marginTop: 14,
    fontSize: 16,
    lineHeight: "24px",
  },
  reply: {
    cursor: "pointer",
  },
  contentContainer: {
    width: "70%",
    padding: "30px 0px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  allCommentsContainer: {
    width: "100%",
  },
  commentContainer: {
    padding: "30px 30px 36px 30px",
  },
  commentInfo: {
    color: colors.BLACK(0.8),
  },
  commentBoxContainer: {
    width: "100%",
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
});

export default Thread;
