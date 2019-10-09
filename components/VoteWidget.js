import { useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";
import { UPVOTE, DOWNVOTE } from "../config/constants";

const VoteWidget = (props) => {
  const score = getScore(props);
  const { onUpvote, onDownvote, fontSize, selected, width } = props;

  const [upvoteSelected, setUpvoteSelected] = useState(false);
  const [downvoteSelected, setDownvoteSelected] = useState(false);

  useEffect(() => {
    if (selected === UPVOTE) {
      setUpvoteSelected(true);
    } else if (selected === DOWNVOTE) {
      setDownvoteSelected(true);
    }
  }, [selected]);

  return (
    <div
      className={css(styles.container, props.styles)}
      style={{ fontSize: fontSize, width: width }}
    >
      <UpvoteButton selected={upvoteSelected} onClick={onUpvote} />
      <ScorePill score={score} />
      <DownvoteButton selected={downvoteSelected} onClick={onDownvote} />
    </div>
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

const UpvoteButton = (props) => {
  const { onClick, selected } = props;

  const style = [styles.icon];
  if (selected) {
    style.push(styles.selected);
  }

  return (
    <a className={css(...style)} onClick={onClick}>
      {voteWidgetIcons.upvote}
    </a>
  );
};

const DownvoteButton = (props) => {
  const { onClick, selected } = props;

  const style = [styles.icon];
  if (selected) {
    style.push(styles.selected);
  }

  return (
    <a className={css(...style)} onClick={onClick}>
      {voteWidgetIcons.downvote}
    </a>
  );
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
    marginRight: 12,
  },
  pillContainer: {
    background: voteWidgetColors.BACKGROUND,
    color: colors.GREEN(),
    fontWeight: "bold",
    borderRadius: 24,
    padding: ".2em .7em",
  },
  icon: {
    color: voteWidgetColors.ARROW,
  },
  coins: {
    fontSize: 10,
  },
  selected: {
    color: colors.GREEN(),
  },
});

export default VoteWidget;
