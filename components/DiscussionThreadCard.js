import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Fragment, useState, useEffect } from "react";
import { useDispatch, useStore } from "react-redux";

import DiscussionActions from "~/redux/discussion";

import DiscussionCard from "./DiscussionCard";
import DiscussionPostMetadata from "./DiscussionPostMetadata";
import DiscussionThreadActionBar from "./DiscussionThreadActionBar";
import { ClientLinkWrapper } from "./LinkWrapper";
import VoteWidget from "./VoteWidget";

import { UPVOTE, DOWNVOTE } from "~/config/constants";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { getNestedValue } from "~/config/utils";

const DYNAMIC_HREF = "/paper/[paperId]/[tabName]/[discussionThreadId]";

const DiscussionThreadCard = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const { paperId } = router.query;

  const { hostname, hoverEvents, path, mobileView } = props;

  const data = getNestedValue(props, ["data"]);

  let date = "";
  let title = "";
  let username = "";
  let commentCount = "";
  let vote = null;
  let threadId = null;

  if (data) {
    threadId = data.id;
    commentCount = data.commentCount;
    date = data.createdDate;
    title = data.title;
    username = createUsername(data);
    vote = data.userVote;
  }

  const [selectedVoteType, setSelectedVoteType] = useState(
    vote && vote.voteType
  );
  const [score, setScore] = useState((data && data.score) || 0);

  useEffect(() => {
    setSelectedVoteType(data.userVote && data.userVote.voteType);
  }, [data]);

  async function upvote() {
    dispatch(DiscussionActions.postUpvotePending());
    await dispatch(DiscussionActions.postUpvote(paperId, threadId));
    updateWidgetUI();
  }

  async function downvote() {
    dispatch(DiscussionActions.postDownvotePending());
    await dispatch(DiscussionActions.postDownvote(paperId, threadId));
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

  const goToDiscussion = () => {};

  if (mobileView) {
    return (
      <div
        className={css(
          styles.discussionContainer,
          props.newCard && styles.newCard
        )}
        onClick={goToDiscussion}
      >
        <DiscussionCard
          mobileView={true}
          top={
            <div className={css(styles.column)}>
              <VoteWidget
                score={score}
                fontSize={"16px"}
                width={"44px"}
                selected={selectedVoteType}
                onUpvote={upvote}
                onDownvote={downvote}
                horizontalView={true}
                styles={styles.mobileVoteWidget}
              />
              <DiscussionPostMetadata
                authorProfile={data.createdBy.authorProfile}
                username={username}
                date={date}
              />
            </div>
          }
          info={
            <ClientLinkWrapper dynamicHref={DYNAMIC_HREF} path={path}>
              <Title text={title} />
            </ClientLinkWrapper>
          }
          action={
            <Fragment>
              <span className={css(styles.mobileReadButton)}>
                <ReadButton threadPath={path} />
              </span>
              <DiscussionThreadActionBar
                hostname={hostname}
                threadPath={path}
                title={title}
                count={commentCount}
              />
            </Fragment>
          }
          hoverEvents={hoverEvents && hoverEvents}
        />
      </div>
    );
  } else {
    return (
      <div
        className={css(
          styles.discussionContainer,
          props.newCard && styles.newCard
        )}
        onClick={goToDiscussion}
      >
        <DiscussionCard
          top={
            <Fragment>
              <VoteWidget
                score={score}
                fontSize={"16px"}
                width={"44px"}
                selected={selectedVoteType}
                onUpvote={upvote}
                onDownvote={downvote}
              />
              <DiscussionPostMetadata
                authorProfile={data.createdBy.authorProfile}
                username={username}
                date={date}
              />
              <ReadButton threadPath={path} />
            </Fragment>
          }
          info={
            <ClientLinkWrapper dynamicHref={DYNAMIC_HREF} path={path}>
              <Title text={title} />
            </ClientLinkWrapper>
          }
          action={
            <DiscussionThreadActionBar
              hostname={hostname}
              threadPath={path}
              title={title}
              count={commentCount}
            />
          }
          hoverEvents={hoverEvents && hoverEvents}
        />
      </div>
    );
  }
};

function createUsername({ createdBy }) {
  if (createdBy) {
    const { firstName, lastName } = createdBy;
    return `${firstName} ${lastName}`;
  }
  return null;
}

DiscussionThreadCard.propTypes = {
  date: PropTypes.object,
  path: PropTypes.string,
  title: PropTypes.string,
  username: PropTypes.string,
};

const Title = (props) => {
  const title = formatTitle(props.text);

  return <div className={css(styles.title)}>{title}</div>;
};

function formatTitle(title) {
  const limit = 80;
  if (title.length > limit) {
    return title.substring(0, limit) + "...";
  }
  return title;
}

const ReadButton = (props) => {
  const { threadPath } = props;
  return (
    <ClientLinkWrapper
      dynamicHref={DYNAMIC_HREF}
      path={threadPath}
      styling={[styles.readContainer]}
      id={"readLabel"}
    >
      <span className={css(styles.readLabel)}>Read</span>{" "}
      <span className={css(styles.readArrow)}>{icons.chevronRight}</span>
    </ClientLinkWrapper>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "12px",
    whiteSpace: "nowrap",
  },
  timestampDivider: {
    padding: "0px 10px",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    color: colors.GREY(1),
    fontSize: 14,
  },
  discussionContainer: {
    textDecoration: "none",
    cursor: "default",
    transition: "all ease-in-out 0.2s",
  },
  readContainer: {
    border: "solid 1px",
    borderColor: colors.BLUE(1),
    color: colors.BLUE(1),
    borderRadius: "2px",
    height: "30px",
    width: "90px",
    minWidth: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    textDecoration: "none",
    ":hover": {
      backgroundColor: colors.BLUE(1),
      color: "#FFF",
    },
    "@media only screen and (max-width: 321px)": {
      minWidth: "unset",
      width: 70,
    },
  },
  readLabel: {
    fontSize: 14,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  readArrow: {
    fontSize: 10,
    marginLeft: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 1,
    height: 19,
    maxHeight: 19,
  },
  title: {
    fontSize: 22,
    paddingBottom: 18,
    // color: colors.BLACK(1),
    color: "#232038",
    textOverflow: "eclipsis",
    "@media only screen and (max-width: 436px)": {
      fontSize: 18,
    },
  },
  link: {
    textDecoration: "none",
  },
  newCard: {
    backgroundColor: colors.LIGHT_GREEN(1),
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 19,
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  mobileVoteWidget: {
    paddingLeft: 20,
    marginBottom: 15,
  },
  mobileReadButton: {
    marginRight: 20,
  },
});

export default DiscussionThreadCard;
