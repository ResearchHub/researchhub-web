import { Fragment, useState, useEffect } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

// Components
import DiscussionCard from "~/components/DiscussionCard";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import ThreadEditor from "~/components/DiscussionThreadEditor";
import EditAction from "~/components/EditAction";
import ShareAction from "~/components/ShareAction";
import VoteWidget from "~/components/VoteWidget";

// Redux
import DiscussionActions from "~/redux/discussion";

// Utils
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import colors, { discussionPageColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { createUsername, getCurrentUser, getNestedValue } from "~/config/utils";

const Thread = (props) => {
  const { hostname, title, body, createdBy, date, score, vote } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const currentUser = getCurrentUser(store.getState());
  const canEdit = createdBy.id === currentUser.id;
  const username = createUsername({ createdBy });

  const currentUrl = hostname + router.asPath;
  const { paperId, discussionThreadId } = router.query;

  const [readOnly, setReadOnly] = useState(true);
  const [selectedVoteType, setSelectedVoteType] = useState(
    vote && vote.voteType
  );

  useEffect(() => {
    setSelectedVoteType(vote && vote.voteType);
  }, [vote]);

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
            <ShareAction
              title={"Share this thread"}
              subtitle={title}
              url={currentUrl}
            />
          </Fragment>
        }
        info={
          <ThreadEditor
            readOnly={readOnly}
            styling={[styles.body]}
            text={body}
            setReadOnly={setReadOnly}
          />
        }
        infoStyle={styles.threadInfo}
        action={
          <Fragment>
            <DiscussionPostMetadata username={username} date={date} />
            {canEdit && (
              <EditAction onClick={setReadOnly} readOnly={readOnly} />
            )}
          </Fragment>
        }
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
          {icons.longArrowLeft}
          <span className={css(styles.backButtonLabel)}>{message}</span>
        </a>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    paddingLeft: 68,
    marginBottom: 10,
  },
  backButton: {
    color: colors.BLACK(0.5),
    textDecoration: "none",
    ":hover": {
      color: colors.BLACK(1),
    },
  },
  backButtonLabel: {
    marginLeft: 10,
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
