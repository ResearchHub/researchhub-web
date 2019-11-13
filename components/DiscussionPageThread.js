import { Fragment, useState, useEffect } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

// Components
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
  const { hostname, title, body, createdBy, date, vote } = props;

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
  const [score, setScore] = useState(props.score);

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

  function renderActionBar() {
    return (
      <div className={css(styles.actions)}>
        {canEdit && (
          <EditAction
            onClick={setReadOnly}
            readOnly={readOnly}
            iconView={true}
          />
        )}
        {readOnly && (
          <ShareAction
            title={"Share this thread"}
            subtitle={title}
            url={currentUrl}
            addRipples={true}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={css(
        styles.cardContainer,
        !readOnly && styles.cardContainerEdit
      )}
    >
      <div className={css(styles.column, styles.left)}>
        <VoteWidget
          selected={selectedVoteType}
          styles={styles.voteWidget}
          score={score}
          fontSize={"16px"}
          width={"58px"}
          onUpvote={upvote}
          onDownvote={downvote}
        />
      </div>
      <div className={css(styles.column, styles.right)}>
        <BackButton />
        <div className={css(styles.titleBar)}>
          <div
            className={css(
              styles.threadTitle,
              !readOnly && styles.threadTitleEdit
            )}
          >
            {title}
          </div>
          <div className={css(styles.actionbar)}>
            <div className={css(styles.mobileVoteWidget)}>
              <VoteWidget
                selected={selectedVoteType}
                styles={styles.voteWidget}
                score={score}
                fontSize={"16px"}
                width={"58px"}
                horizontalView={true}
                onUpvote={upvote}
                onDownvote={downvote}
              />
            </div>
            {renderActionBar()}
          </div>
        </div>
        <div
          className={css(
            styles.threadInfo,
            !readOnly && styles.threadInfoEditView
          )}
        >
          <ThreadEditor
            readOnly={readOnly}
            styling={[styles.body]}
            text={body}
            setReadOnly={setReadOnly}
            commentStyles={
              readOnly ? styles.commentStyles : styles.commentStylesEdit
            }
          />
        </div>
        {readOnly && (
          <DiscussionPostMetadata
            authorProfile={createdBy.authorProfile}
            username={username}
            date={date}
          />
        )}
      </div>
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
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    padding: "30px 0 30px 0",
    position: "sticky",
    top: 0,
  },
  cardContainerEdit: {
    // backgroundColor: colors.LIGHT_YELLOW(1),
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  left: {
    paddingTop: 40,
    "@media only screen and (max-width: 761px)": {
      display: "none",
    },
  },
  mobileVoteWidget: {
    display: "none",
    "@media only screen and (max-width: 761px)": {
      display: "flex",
      paddingLeft: 15,
    },
  },
  actionbar: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    "@media only screen and (max-width: 761px)": {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 15,
    },
  },
  actions: {
    display: "flex",
  },
  right: {
    width: "100%",
  },
  titleBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    "@media only screen and (max-width: 761px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  },
  backButtonContainer: {
    paddingBottom: 30,
    "@media only screen and (max-width: 761px)": {
      paddingBottom: 20,
      fontSize: 14,
    },
  },
  commentStyles: {
    padding: 0,
  },
  commentStylesEdit: {
    padding: 16,
    lineHeight: 1.6,
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
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  voteWidget: {
    marginRight: 18,
  },
  threadInfo: {
    margin: "20px 0 20px 0",
    color: colors.BLACK(0.8),
    "@media only screen and (max-width: 761px)": {
      marginTop: 15,
      fontSize: 16,
    },
  },
  threadInfoEditView: {
    minHeight: 200,
    boxShadow: `0px 0px 0px 8px ${colors.LIGHT_YELLOW(1)}`,
    border: "1px solid #E7E7E7",
    backgroundColor: "#FBFBFB",
    margin: 0,
    paddingBottom: 20,
    width: "calc(100% - 76px)",
  },
  threadTitle: {
    width: "100%",
    fontSize: 33,
    color: "#241F3A",
    "@media only screen and (max-width: 761px)": {
      fontSize: 22,
    },
  },
  threadTitleEdit: {
    fontSize: 20,
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
