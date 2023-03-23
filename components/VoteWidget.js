import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import { connect, useDispatch, useStore } from "react-redux";
import ReactTooltip from "react-tooltip";

import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

import { doesNotExist } from "~/config/utils/nullchecks";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "../config/constants";
import { getCurrentUserReputation } from "~/config/utils/reputation";
import { formatScore } from "~/config/utils/form";

// components
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import DiscussionActions from "../redux/discussion";
import { breakpoints } from "~/config/themes/screen";

const VoteWidget = (props) => {
  const dispatch = useDispatch();
  const store = useStore();

  const {
    onUpvote,
    onDownvote,
    fontSize,
    selected,
    width,
    horizontalView,
    searchResult,
    isPaper,
    type,
    promoted,
    paper,
    showPromotion,
    postUpvotePending,
    postUpvote,
    paperId,
    threadId,
    commentId,
    replyId,
    postDownvote,
    postDownvotePending,
    downvoteStyleClass,
    upvoteStyleClass,
    pillClass,
    small,
    onNeutralVote,
    disableUpvote,
    disableDownvote,
    downvoteIcon = voteWidgetIcons.downvote,
    upvoteIcon = voteWidgetIcons.upvote,
  } = props;

  const userReputation = getCurrentUserReputation(store.getState());
  const { permission } = store.getState();
  const [upvoteDisabled] = useState(
    permission.success &&
      userReputation < permission.data.UpvotePaper.minimumReputation
  );
  const [downvoteDisabled] = useState(
    permission.success &&
      userReputation < permission.data.DownvotePaper.minimumReputation
  );
  const [upvoteSelected, setUpvoteSelected] = useState(
    selected === UPVOTE || selected === UPVOTE_ENUM
  );
  const [downvoteSelected, setDownvoteSelected] = useState(
    selected === DOWNVOTE || selected === DOWNVOTE_ENUM
  );

  useEffect(() => {
    if (selected === UPVOTE || selected === UPVOTE_ENUM) {
      setUpvoteSelected(true);
      setDownvoteSelected(false);
    } else if (selected === DOWNVOTE || selected === DOWNVOTE_ENUM) {
      setDownvoteSelected(true);
      setUpvoteSelected(false);
    }
  }, [selected]);

  function onUpvoteClick(e) {
    if (upvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "upvote"));
    } else if (upvoteSelected) {
      onNeutralVote && onNeutralVote();
      setUpvoteSelected(false);
      setDownvoteSelected(false);
      // TODO: show a user state here?
    } else {
      if (isPaper || type === "Discussion") {
        let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
        dispatch(AuthActions.checkUserFirstTime(firstTime));
        dispatch(AuthActions.getUser());
      }
      if (onUpvote) {
        onUpvote(e);
      } else {
        onAfterUpvote();
        setUpvoteSelected(true);
        setDownvoteSelected(false);
      }
    }
  }

  const onAfterDownvote = async () => {
    postDownvotePending();

    await postDownvote(paperId, threadId, commentId, replyId);
  };

  const onAfterUpvote = async () => {
    postUpvotePending();
    await postUpvote(paperId, threadId, commentId, replyId);
  };

  function onDownvoteClick(e) {
    if (downvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "downvote"));
    } else if (downvoteSelected) {
      onNeutralVote && onNeutralVote();
      setUpvoteSelected(false);
      setDownvoteSelected(false);

      // TODO: show a user state here?
    } else {
      if (isPaper || type === "Discussion") {
        let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
        dispatch(AuthActions.checkUserFirstTime(firstTime));
        dispatch(AuthActions.getUser());
      }
      if (onDownvote) {
        onDownvote(e);
      } else {
        onAfterDownvote();
        setUpvoteSelected(false);
        setDownvoteSelected(true);
      }
    }
  }

  const displayableScore = getScore(props);
  const noDownvote = upvoteDisabled || searchResult || disableUpvote;
  const noUpvote = upvoteDisabled || searchResult || disableUpvote;

  return (
    <div
      className={css(
        styles.container,
        horizontalView && styles.horizontalView,
        props.styles
      )}
      style={{ fontSize: fontSize, width: width }}
    >
      <PermissionNotificationWrapper
        loginRequired={true}
        onClick={!noUpvote && onUpvoteClick}
        modalMessage={"vote"}
        hideRipples={noUpvote}
      >
        <UpvoteButton
          selected={upvoteSelected}
          disabled={noUpvote}
          horizontalView={horizontalView && horizontalView}
          styleClass={upvoteStyleClass}
          small={small}
          icon={upvoteIcon}
        />
      </PermissionNotificationWrapper>
      <ReactTooltip
        id="reputationTooltip"
        className={css(styles.tooltip)}
        place="bottom"
        effect="solid"
      />
      <ScorePill
        score={displayableScore}
        promoted={promoted}
        paper={paper}
        showPromotion={showPromotion}
        type={type}
        small={small}
        pillClass={pillClass}
        horizontalView={horizontalView && horizontalView}
      />
      <PermissionNotificationWrapper
        loginRequired={true}
        onClick={!noDownvote && onDownvoteClick}
        modalMessage={"vote"}
        hideRipples={noDownvote}
      >
        <DownvoteButton
          selected={downvoteSelected}
          disabled={downvoteDisabled || searchResult || disableDownvote}
          horizontalView={horizontalView && horizontalView}
          styleClass={downvoteStyleClass}
          small={small}
          icon={downvoteIcon}
        />
      </PermissionNotificationWrapper>
    </div>
  );
};

VoteWidget.propTypes = {
  fontSize: PropTypes.string,
  horizontalView: PropTypes.bool,
  onDownvote: PropTypes.func,
  onUpvote: PropTypes.func,
  score: PropTypes.number,
  width: PropTypes.string,
};

export const ScorePill = (props) => {
  const { score, small, pillClass } = props;

  const isScoreNumeric = !isNaN(score);

  return (
    <div className={css(styles.pillContainer, pillClass)}>
      <div
        className={css(
          small && styles.small,
          !isScoreNumeric && styles.hideScore
        )}
      >
        {formatScore(score)}
      </div>
    </div>
  );
};

const VoteButton = (props) => {
  const {
    onClick,
    selected,
    disabled,
    horizontalView,
    right,
    styleClass,
    small,
  } = props;

  let style = [styles.icon];

  if (disabled) {
    style = [styles.iconDisabled];
  }

  if (selected) {
    style.push(styles.selected);
  }
  if (horizontalView) {
    style.push(styles.horizontalViewButton);
    if (right) {
      style.push(styles.marginRight);
    } else {
      style.push(styles.marginLeft);
    }
  }

  if (small) {
    style.push(styles.smallBtn);
  }

  if (styleClass) {
    style.push(styleClass);
  }

  return (
    <div className={css(...style)} onClick={!disabled && onClick}>
      {props.children}
    </div>
  );
};

const UpvoteButton = (props) => {
  return (
    <VoteButton {...props} right={props.horizontalView}>
      {props.icon}
    </VoteButton>
  );
};

const DownvoteButton = (props) => {
  return <VoteButton {...props}>{props.icon}</VoteButton>;
};

function getScore(props) {
  const { score } = props;
  if (doesNotExist(score)) {
    return 0;
  }
  return score;
}

// const mobileStyles = StyleSheet.create({
//   mobileVote: {
//     fontSize: 14,
//   },
//   mobilePill: {
//     width: 28,
//     fontSize: 14,
//     color: voteWidgetColors.ARROW,
//     background: "unset",
//     width: "unset",
//   },
// });

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    marginRight: 17,
  },
  horizontalView: {
    flexDirection: "row",
    alignItems: "center",
  },
  horizontalViewButton: {
    fontSize: 25,
    "@media only screen and (max-width: 321px)": {
      fontSize: 23,
    },
  },
  pillContainer: {
    background: "rgba(240, 240, 240, 0.5)",
    width: 28,
    margin: "4px auto",
    color: colors.NEW_GREEN(),
    boxSizing: "border-box",
    fontWeight: "bold",
    borderRadius: 5,
    // padding: ".2em .5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
    },
  },
  hideScore: {
    visibility: "hidden",
  },
  horizontalViewPill: {
    minWidth: 50,
  },
  promotedPillContainer: {
    cursor: "help",
  },
  small: {
    fontSize: 14,
  },
  smallBtn: {
    fontSize: 14,
  },
  promotionIcon: {
    fontSize: 11,
    marginLeft: 3,
  },
  icon: {
    cursor: "pointer",
    color: voteWidgetColors.ARROW,
    fontSize: 14,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    ":hover": {
      color: colors.GREEN(0.4),
    },
  },
  iconBlue: {
    color: "#eaebfe",
  },
  iconDisabled: {
    color: voteWidgetColors.ARROW,
  },
  coins: {
    fontSize: 10,
  },
  selectedBlue: {
    color: colors.BLUE(),
    // color: colors.GREEN(),
  },
  selected: {
    color: colors.GREEN(),
  },
  marginRight: {
    marginRight: 5,
  },
  promotionContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100%",
    display: "none",
    cursor: "pointer",
    "@media only screen and (max-width: 767px)": {
      display: "unset",
    },
  },
  marginLeft: {
    marginLeft: 5,
  },
  divider: {
    margin: "5px 0 15px",
    width: "100%",
    border: "1px solid rgba(36, 31, 58, 0.1)",
  },
  scoreContainer: {
    color: "rgba(36, 31, 58, 0.4)",
    fontWeight: "bold",
    fontSize: 14,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  tooltip: {
    maxWidth: 200,
    width: 200,
    padding: 15,
    fontSize: 14,
    // background: colors.BLUE(1),
    background: "rgba(0, 0, 0, 0.7)",
    opacity: 1,
  },
});

const mapDispatchToProps = {
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
};

export default connect(null, mapDispatchToProps)(VoteWidget);
