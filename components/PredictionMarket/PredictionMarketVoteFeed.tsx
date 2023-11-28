import { Fragment, ReactElement, useMemo } from "react";
import PredictionMarketVoteItem from "./PredictionMarketVoteItem";
import { PredictionMarketVote } from "./lib/types";
import { StyleSheet, css } from "aphrodite";
import CommentPlaceholder from "../Comment/CommentPlaceholder";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

export type PredictionMarketVoteFeedProps = {
  votes: PredictionMarketVote[];
  isFetching: boolean;
};

const PredictionMarketVoteFeed = ({
  isFetching,
  votes,
}: PredictionMarketVoteFeedProps): ReactElement => {
  const yesVotes = useMemo(
    () => votes.filter((vote) => vote.vote === "YES"),
    [votes]
  );
  const noVotes = useMemo(
    () => votes.filter((vote) => vote.vote === "NO"),
    [votes]
  );

  return (
    <>
      {isFetching && (
        <div className={css(styles.placeholderWrapper)}>
          <CommentPlaceholder />
        </div>
      )}
      {!isFetching && (
        <div className={css(styles.votes)}>
          {yesVotes.length > 0 && (
            <div className={css(styles.votesColumn)}>
              {yesVotes.map((vote, i) => (
                <Fragment key={vote.id}>
                  <PredictionMarketVoteItem vote={vote} />
                  {i !== yesVotes.length - 1 && (
                    <div className={css(styles.divider)} />
                  )}
                </Fragment>
              ))}
            </div>
          )}
          <div className={css(styles.votesColumn)}>
            {noVotes.map((vote, i) => (
              <Fragment key={vote.id}>
                <PredictionMarketVoteItem vote={vote} />
                {i !== noVotes.length - 1 && (
                  <div className={css(styles.divider)} />
                )}
              </Fragment>
            ))}
          </div>
          {/* create an empty column so that the "no" votes column is limited to 50% width */}
          {yesVotes.length === 0 && <div className={css(styles.votesColumn)} />}
        </div>
      )}
      {!isFetching && votes.length === 0 && (
        <div className={css(styles.emptyStateWrapper)}>No votes yet.</div>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  placeholderWrapper: {
    marginTop: 15,
  },
  emptyStateWrapper: {
    color: colors.BLACK(0.6),
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
    justifyContent: "center",
    lineHeight: "34px",
    fontSize: 18,
    height: 200,
  },
  votes: {
    display: "flex",
    flexDirection: "row",
    gap: 36,
    marginTop: 24,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      gap: 24,
    },
  },
  votesColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flex: 1,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.GREY_BORDER,
  },
});

export default PredictionMarketVoteFeed;
