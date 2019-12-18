import { useEffect, useState, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import { useDispatch, useStore } from "react-redux";

import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import ReputationTooltip from "./ReputationTooltip";

import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";
import { UPVOTE, DOWNVOTE } from "../config/constants";
import { getCurrentUserReputation } from "../config/utils";

import "./stylesheets/voteTooltip.css";
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
  } = props;
  const score = getScore(props);

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

  const [upvoteSelected, setUpvoteSelected] = useState(selected === UPVOTE);
  const [downvoteSelected, setDownvoteSelected] = useState(
    selected === DOWNVOTE
  );

  useEffect(() => {
    if (selected === UPVOTE) {
      setUpvoteSelected(true);
      setDownvoteSelected(false);
    } else if (selected === DOWNVOTE) {
      setDownvoteSelected(true);
      setUpvoteSelected(false);
    }
  }, [selected]);

  function onUpvoteClick(e) {
    if (upvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "upvote"));
    } else if (upvoteSelected) {
      console.log("Vote already cast");
    } else {
      if (isPaper || type === "discussion") {
        let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
        dispatch(AuthActions.checkUserFirstTime(firstTime));
        dispatch(AuthActions.getUser());
      }
      onUpvote(e);
    }
  }

  function onDownvoteClick(e) {
    if (downvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "downvote"));
    } else if (downvoteSelected) {
      console.log("Vote already cast");
    } else {
      if (isPaper || type === "discussion") {
        let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
        dispatch(AuthActions.checkUserFirstTime(firstTime));
        dispatch(AuthActions.getUser());
      }
      onDownvote(e);
    }
  }

  return (
    <Fragment>
      <div
        className={css(
          styles.container,
          horizontalView && styles.horizontalView,
          props.styles
        )}
        style={{ fontSize: fontSize, width: width }}
        data-tip
        data-for="reputationTooltip"
      >
        <PermissionNotificationWrapper
          loginRequired={true}
          onClick={horizontalView ? onDownvoteClick : onUpvoteClick}
          modalMessage={"vote"}
        >
          {horizontalView ? (
            <DownvoteButton
              selected={downvoteSelected}
              disabled={downvoteDisabled || searchResult}
              horizontalView={horizontalView}
            />
          ) : (
            <UpvoteButton
              selected={upvoteSelected}
              disabled={upvoteDisabled || searchResult}
            />
          )}
        </PermissionNotificationWrapper>
        <ScorePill score={score} />
        <PermissionNotificationWrapper
          loginRequired={true}
          onClick={horizontalView ? onUpvoteClick : onDownvoteClick}
          modalMessage={"vote"}
        >
          {horizontalView ? (
            <UpvoteButton
              selected={upvoteSelected}
              disabled={upvoteDisabled || searchResult}
              horizontalView={horizontalView}
            />
          ) : (
            <DownvoteButton
              selected={downvoteSelected}
              disabled={downvoteDisabled || searchResult}
            />
          )}
        </PermissionNotificationWrapper>
      </div>
      {!searchResult && <ReputationTooltip />}
    </Fragment>
  );
};

VoteWidget.propTypes = {
  fontSize: PropTypes.string,
  onUpvote: PropTypes.func,
  onDownvote: PropTypes.func,
  score: PropTypes.number,
  width: PropTypes.string,
};

const ScorePill = (props) => {
  const { score } = props;
  return (
    <div className={css(styles.pillContainer)}>
      <div>{score}</div>
      {/* <div className={css(styles.coins)}> coins </div> */}
    </div>
  );
};

const VoteButton = (props) => {
  const { onClick, selected, disabled, horizontalView, right } = props;

  let style = [styles.icon];
  if (selected) {
    style.push(styles.selected);
  }
  if (disabled) {
    style = [styles.iconDisabled];
  }
  if (horizontalView) {
    style.push(styles.horizontalViewButton);
    if (right) {
      style.push(styles.marginLeft);
    } else {
      style.push(styles.marginRight);
    }
  }

  return (
    <a className={css(...style)} onClick={onClick}>
      {props.children}
    </a>
  );
};

const UpvoteButton = (props) => {
  return (
    <VoteButton {...props} right={props.horizontalView}>
      {voteWidgetIcons.upvote}
    </VoteButton>
  );
};

const DownvoteButton = (props) => {
  return <VoteButton {...props}>{voteWidgetIcons.downvote}</VoteButton>;
};

function getScore(props) {
  const { score } = props;
  if (doesNotExist(score)) {
    return 0;
  }
  return score;
}

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
    background: voteWidgetColors.BACKGROUND,
    color: colors.GREEN(),
    fontWeight: "bold",
    borderRadius: 24,
    padding: ".2em .9em",
  },
  icon: {
    cursor: "pointer",
    color: voteWidgetColors.ARROW,
    ":hover": {
      color: colors.BLUE(1),
    },
  },
  iconDisabled: {
    cursor: "not-allowed",
    color: voteWidgetColors.ARROW,
  },
  coins: {
    fontSize: 10,
  },
  selected: {
    color: colors.GREEN(),
    cursor: "not-allowed",
  },
  marginLeft: {
    marginLeft: 8,
  },
  marginRight: {
    marginRight: 8,
  },
});

export default VoteWidget;
