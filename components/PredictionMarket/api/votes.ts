import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";
import { ID } from "~/config/types/root_types";
import { captureEvent } from "~/config/utils/events";
import { PredictionMarketVote, parsePredictionMarketVote } from "../lib/types";

export const createVote = async ({
  predictionMarketId,
  paperId,
  vote,
  betAmount,
}: {
  predictionMarketId: ID;
  paperId: ID;
  vote: boolean;
  betAmount?: number;
}): Promise<{
  vote?: PredictionMarketVote;
}> => {
  try {
    const response = await fetch(
      API.PREDICTION_MARKET_VOTE(),
      API.POST_CONFIG(
        {
          prediction_market_id: predictionMarketId,
          paper_id: paperId,
          vote,
          bet_amount: betAmount,
        },
        undefined
      )
    ).then((res): any => Helpers.parseJSON(res));

    return {
      vote: parsePredictionMarketVote(response),
    };
  } catch (err) {
    captureEvent({
      msg: "Error creating vote",
      data: { predictionMarketId, vote, betAmount },
    });

    throw Error(err as any);
  }
};

export const fetchVotes = async ({
  predictionMarketId,
  sort,
}: {
  predictionMarketId: ID;
  sort?: string;
}): Promise<{
  votes?: PredictionMarketVote[];
}> => {
  try {
    const response = await fetch(
      API.PREDICTION_MARKET_VOTE({
        predictionMarketId,
        ordering: sort?.toLowerCase(),
      }),
      API.GET_CONFIG()
    ).then((res): any => Helpers.parseJSON(res));

    return {
      votes: response.map(parsePredictionMarketVote),
    };
  } catch (err) {
    captureEvent({
      msg: "Error fetching votes",
      data: { predictionMarketId },
    });

    throw Error(err as any);
  }
};

export const fetchVotesForUser = async ({
  predictionMarketId,
}: {
  predictionMarketId: ID;
}): Promise<{
  votes?: PredictionMarketVote[];
}> => {
  try {
    const response = await fetch(
      API.PREDICTION_MARKET_VOTE({ predictionMarketId, isUserVote: true }),
      API.GET_CONFIG()
    ).then((res): any => Helpers.parseJSON(res));

    return {
      votes: response.map(parsePredictionMarketVote),
    };
  } catch (err) {
    captureEvent({
      msg: "Error fetching votes for user",
      data: { predictionMarketId },
    });

    throw Error(err as any);
  }
};

export const deleteVote = async ({ voteId }: { voteId: ID }): Promise<void> => {
  try {
    await fetch(
      API.PREDICTION_MARKET_VOTE({ voteId }),
      API.DELETE_CONFIG()
    ).then(Helpers.checkStatus);

    return;
  } catch (err) {
    captureEvent({
      msg: "Error deleting vote",
      data: { voteId },
    });

    throw Error(err as any);
  }
};
