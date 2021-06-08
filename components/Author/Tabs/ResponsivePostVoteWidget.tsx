import { css, StyleSheet } from "aphrodite";
import React from "react";
import Responsive from "../../Responsive";
import VoteWidget from "../../VoteWidget";

export type ResponsvePostVoteWidgetProps = {
  onDesktop: boolean;
  onUpvote: Function;
  onDownvote: Function;
  isSelected: boolean;
  score: number;
};

export default function ResponsvePostVoteWidget({
  onUpvote,
  onDownvote,
  isSelected,
  score,
  onDesktop,
}: ResponsvePostVoteWidgetProps) {
  return (
    <Responsive desktopOnly={onDesktop}>
      <div className={css(styles.column)}>
        <span
          className={css(styles.voting)}
          onClick={(e) => e.stopPropagation()}
        >
          <VoteWidget
            score={score}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            selected={isSelected}
            styles={styles.voteWidget}
            type="Discussion"
            promoted={false}
            horizontalView={!onDesktop}
          />
        </span>
      </div>
    </Responsive>
  );
}

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  voting: {
    width: 60,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
    },
  },
  voteWidget: {
    marginRight: 15,
  },
});
