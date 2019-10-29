import { useEffect, useState, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import { useDispatch, useStore } from "react-redux";

import { ModalActions } from "../redux/modals";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";
import { UPVOTE, DOWNVOTE } from "../config/constants";
import { getCurrentUserReputation } from "../config/utils";

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
      onUpvote(e);
    }
  }

  function onDownvoteClick(e) {
    if (downvoteDisabled) {
      dispatch(ModalActions.openPermissionNotificationModal(true, "downvote"));
    } else if (downvoteSelected) {
      console.log("Vote already cast");
    } else {
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
      >
        {horizontalView ? (
          <DownvoteButton
            selected={downvoteSelected}
            disabled={downvoteDisabled}
            onClick={onDownvoteClick}
            horizontalView={horizontalView}
          />
        ) : (
          <UpvoteButton
            selected={upvoteSelected}
            disabled={upvoteDisabled}
            onClick={onUpvoteClick}
          />
        )}
        <ScorePill score={score} />
        {horizontalView ? (
          <UpvoteButton
            selected={upvoteSelected}
            disabled={upvoteDisabled}
            onClick={onUpvoteClick}
            horizontalView={horizontalView}
          />
        ) : (
          <DownvoteButton
            selected={downvoteSelected}
            disabled={downvoteDisabled}
            onClick={onDownvoteClick}
          />
        )}
      </div>
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
    marginLeft: 5,
  },
  marginRight: {
    marginRight: 5,
  },
});

export default VoteWidget;
