import { useEffect, useState, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import { useStore } from "react-redux";

import PermissionNotification from "./PermissionNotification";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";
import { UPVOTE, DOWNVOTE } from "../config/constants";
import { getCurrentUserReputation } from "../config/utils";

const VoteWidget = (props) => {
  const store = useStore();

  const { onUpvote, onDownvote, fontSize, selected, width } = props;
  const score = getScore(props);

  const userReputation = getCurrentUserReputation(store.getState());
  const { permissions } = store.getState();

  const [upvoteDisabled] = useState(
    permissions.success &&
      userReputation < permissions.data.UpvotePaper.minimumReputation
  );
  const [downvoteDisabled] = useState(
    permissions.success &&
      userReputation < permissions.data.DownvotePaper.minimumReputation
  );

  const [notificaitonOpen, setNotificaitonOpen] = useState(false);

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
      setNotificaitonOpen(true);
    } else {
      onUpvote(e);
    }
  }

  function onDownvoteClick(e) {
    if (downvoteDisabled) {
      setNotificaitonOpen(true);
    } else {
      onDownvote(e);
    }
  }

  return (
    <Fragment>
      <div
        className={css(styles.container, props.styles)}
        style={{ fontSize: fontSize, width: width }}
      >
        <UpvoteButton
          selected={upvoteSelected}
          disabled={upvoteDisabled}
          onClick={onUpvoteClick}
        />
        <ScorePill score={score} />
        <DownvoteButton
          selected={downvoteSelected}
          disabled={downvoteDisabled}
          onClick={onDownvoteClick}
        />
      </div>
      <PermissionNotification
        isOpen={notificaitonOpen}
        action="vote"
        close={() => {
          setNotificaitonOpen(false);
        }}
      />
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
  const { onClick, selected, disabled } = props;

  let style = [styles.icon];
  if (selected) {
    style.push(styles.selected);
  }
  if (disabled) {
    style = [styles.iconDisabled];
  }

  return (
    <a className={css(...style)} onClick={onClick}>
      {props.children}
    </a>
  );
};

const UpvoteButton = (props) => {
  return <VoteButton {...props}>{voteWidgetIcons.upvote}</VoteButton>;
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
  pillContainer: {
    background: voteWidgetColors.BACKGROUND,
    color: colors.GREEN(),
    fontWeight: "bold",
    borderRadius: 24,
    padding: ".2em .7em",
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
});

export default VoteWidget;
