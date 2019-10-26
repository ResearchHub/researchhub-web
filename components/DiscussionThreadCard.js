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

  const { hostname, hoverEvents, path } = props;

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

  goToDiscussion = () => {};

  return (
    <div
      className={css(styles.discussionContainer)}
      onClick={this.goToDiscussion}
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
  },
  readLabel: {
    fontSize: 14,
    fontFamily: "Roboto",
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
    paddingBottom: 16,
    color: colors.BLACK(1),
  },
  link: {
    textDecoration: "none",
  },
});

export default DiscussionThreadCard;
