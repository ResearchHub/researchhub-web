import { css, StyleSheet } from "aphrodite";

import { doesNotExist } from "~/config/utils";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import { voteWidgetIcons } from "~/config/themes/icons";

const VoteWidget = (props) => {
  const score = getScore(props);
  const { onUpvote, onDownvote, fontSize, width } = props;

  return (
    <div
      className={css(styles.container)}
      style={{ fontSize: fontSize, width: width }}
    >
      <UpvoteButton onClick={onUpvote} />
      <ScorePill score={score} />
      <DownvoteButton onClick={onDownvote} />
    </div>
  );
};

const ScorePill = (props) => {
  const { score } = props;
  return (
    <div className={css(styles.pillContainer)}>
      <div>{score}</div>
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
    return "--";
  }
  return score;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  pillContainer: {
    background: voteWidgetColors.BACKGROUND,
    color: colors.GREEN(),
    fontWeight: "bold",
    borderRadius: ".7em",
    padding: ".2em .4em",
  },
  icon: {
    color: voteWidgetColors.ARROW,
  },
});

export default VoteWidget;
