import Responsive from "../../Responsive";
import VoteWidget from "../../VoteWidget";
import { css, StyleSheet } from "aphrodite";

export type ResponsivePostVoteWidgetProps = {
  onDesktop: boolean;
  onDownvote: Function;
  onUpvote: Function;
  score: number;
  voteState: string | null;
};

export default function ResponsivePostVoteWidget({
  onDesktop,
  onDownvote,
  onUpvote,
  score,
  voteState,
}: ResponsivePostVoteWidgetProps) {
  return (
    <Responsive onDesktop={onDesktop}>
      <div className={css(styles.column)}>
        <span
          className={css(styles.voting)}
          onClick={(e) => e.stopPropagation()}
        >
          <VoteWidget
            horizontalView={!onDesktop}
            onDownvote={onDownvote}
            onUpvote={onUpvote}
            promoted={false}
            score={score}
            styles={styles.voteWidget}
            type="Discussion"
            selected={voteState}
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
