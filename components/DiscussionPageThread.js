import { Fragment, useState, useEffect } from "react";

// NPM Modules
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

// Components
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import DiscussionThreadEditor from "~/components/DiscussionThreadEditor";
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
  const { thread, hostname, title, body, createdBy, date, vote } = props;
  let created_by = createdBy;
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const currentUser = getCurrentUser(store.getState());
  const canEdit = createdBy.id === currentUser.id;
  const username = createUsername({ created_by });

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
      <BackButton />
      <div className={css(styles.column, styles.left)}>
        <VoteWidget
          selected={selectedVoteType}
          styles={styles.voteWidget}
          score={score}
          onUpvote={upvote}
          onDownvote={downvote}
          type={"discussion"}
        />
      </div>
      <div className={css(styles.column, styles.right)}>
        <div className={css(styles.postMetaDataContainer)}>
          <div className={css(styles.mobileVoteWidget)}>
            <VoteWidget
              selected={selectedVoteType}
              styles={styles.voteWidget}
              score={score}
              horizontalView={true}
              onUpvote={upvote}
              onDownvote={downvote}
              type={"discussion"}
            />
          </div>
          <DiscussionPostMetadata
            authorProfile={createdBy.author_profile}
            username={username}
            date={date}
            data={thread}
            metaData={{
              contentType: "thread",
              objectId: thread.id,
            }}
          />
        </div>
        <div className={css(styles.titleBar)}>
          <div
            className={css(
              styles.threadTitle,
              !readOnly && styles.threadTitleEdit
            )}
          >
            {/* {title} */}
            <DiscussionThreadEditor
              readOnly={readOnly}
              styling={readOnly ? [styles.body] : [styles.bodyEdit]}
              text={body}
              setReadOnly={setReadOnly}
              commentStyles={
                readOnly ? styles.commentStyles : styles.commentStylesEdit
              }
              onCancel={() => setReadOnly(true)}
            />
          </div>
          <div className={css(styles.actionbar)}>{renderActionBar()}</div>
        </div>
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
      <Link href={"/paper/[paperId]/[paperName]"} as={url}>
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
    position: "relative",
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
    marginTop: 40,
    "@media only screen and (max-width: 761px)": {
      display: "none",
    },
  },
  mobileVoteWidget: {
    display: "none",
    "@media only screen and (max-width: 761px)": {
      display: "flex",
    },
  },
  actionbar: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    position: "absolute",
    top: 30,
    right: 0,
  },
  actions: {
    display: "flex",
  },
  right: {
    width: "100%",
  },
  columnEdit: {
    backgroundColor: colors.LIGHT_YELLOW(1),
  },
  postMetaDataContainer: {
    marginTop: 55,
    marginBottom: 25,
    "@media only screen and (max-width: 761px)": {
      display: "flex",
    },
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
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 2,
    cursor: "pointer",
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
    background: "#FAFAFD",
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
    margin: 0,
    marginRight: 18,
    "@media only screen and (max-width: 415px)": {
      width: 35,
    },
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
    boxShadow: `0px 0px 0px 5px ${colors.LIGHT_YELLOW(1)}`,
    border: "1px solid #E7E7E7",
    backgroundColor: "#FBFBFB",
    margin: "15px 0",
    paddingBottom: 20,
    width: "calc(100% - 76px)",
  },
  threadTitle: {
    width: "85%",
    minWidth: "85%",
    maxWidth: "85%",
    fontSize: 20,
    color: "#241F3A",
    marginBottom: 20,
    "@media only screen and (max-width: 761px)": {
      fontSize: 18,
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%",
    },
  },
  threadTitleEdit: {
    fontSize: 20,
    width: "calc(100% - 76px)",
    minWidth: "calc(100% - 76px)",
    maxWidth: "calc(100% - 76px)",
    border: "1px solid rgb(232, 232, 242)",
    borderRadius: 4,
  },
  body: {
    marginBottom: 28,
    marginTop: 14,
    fontSize: 16,
    lineHeight: "24px",
  },
  bodyEdit: {},
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
