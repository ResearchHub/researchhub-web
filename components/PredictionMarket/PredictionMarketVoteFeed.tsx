import { Fragment, ReactElement, useEffect, useMemo, useState } from "react";
import PredictionMarketVoteItem from "./PredictionMarketVoteItem";
import { PredictionMarketVote } from "./lib/types";
import { ID } from "~/config/types/root_types";
import { fetchVotes } from "./api/votes";
import { StyleSheet, css } from "aphrodite";
import CommentPlaceholder from "../Comment/CommentPlaceholder";
import { captureEvent } from "~/config/utils/events";
import colors from "~/config/themes/colors";
import { SortOptionValue } from "./lib/options";
import { breakpoints } from "~/config/themes/screen";

export type PredictionMarketVoteFeedProps = {
  marketId: ID;
  // votes that we want to include, that haven't been fetched yet.
  // we use this to update the UI when a user submits a vote
  includeVotes?: PredictionMarketVote[];
};

const PredictionMarketVoteFeed = ({
  marketId,
  includeVotes = [],
}: PredictionMarketVoteFeedProps): ReactElement => {
  const [votes, setVotes] = useState<PredictionMarketVote[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleFetch = async ({
    sort = "CREATED_DATE",
  }: {
    sort?: SortOptionValue;
  }) => {
    setIsFetching(true);
    try {
      const { votes } = await fetchVotes({
        predictionMarketId: marketId,
        sort: sort ? `-${sort}` : undefined,
      });

      if (votes) {
        setVotes(votes);
      }
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch votes",
        data: { document },
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    handleFetch({});
  }, []);

  useEffect(() => {
    // add `includeVotes` to the votes list if they are not already there
    const newVotes = [...votes];
    includeVotes.forEach((vote) => {
      if (!votes.find((v) => v.id === vote.id)) {
        newVotes.push(vote);
      } else {
        // if the vote is already there, update it
        const index = newVotes.findIndex((v) => v.id === vote.id);
        newVotes[index] = vote;
      }
    });
    setVotes(newVotes);
  }, [includeVotes]);

  const yesVotes = useMemo(
    () => votes.filter((vote) => vote.vote === true),
    [votes]
  );
  const noVotes = useMemo(
    () => votes.filter((vote) => vote.vote === false),
    [votes]
  );

  return (
    <div>
      <div className={css(styles.header)}>
        Votes
        {votes.length > 0 && (
          <div className={css(styles.pillContent)}>{votes.length}</div>
        )}
      </div>
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
        </div>
      )}
      {!isFetching && votes.length === 0 && (
        <div className={css(styles.emptyStateWrapper)}>No votes yet.</div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: "45px 0 15px 0",
    display: "flex",
    paddingBottom: 8,
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 400,
    gap: 6,
  },
  pillContent: {
    background: "#F5F5F9",
    borderRadius: "5px",
    padding: "2px 10px",
    color: colors.BLACK(0.5),
    fontSize: 14,
  },
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
