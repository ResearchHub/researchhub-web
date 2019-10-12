import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";

const VoteWidget = (props) => {
  const score = getScore(props);
  const { onUpvote, onDownvote, fontSize, width } = props;

  return (
    <div
      className={css(styles.container, props.styles)}
      style={{ fontSize: fontSize, width: width }}
    >
      <UpvoteButton onClick={onUpvote} />
      <ScorePill score={score} />
      <DownvoteButton onClick={onDownvote} />
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

const UpvoteButton = () => {
  // TODO: execute onClick function
  return <div className={css(styles.icon)}>{voteWidgetIcons.upvote}</div>;
};

const DownvoteButton = () => {
  // TODO: execute onClick function
  return <div className={css(styles.icon)}>{voteWidgetIcons.downvote}</div>;
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
  coins: {
    fontSize: 10,
  },
});

export default VoteWidget;
