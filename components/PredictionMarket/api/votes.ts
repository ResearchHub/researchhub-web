import { Helpers } from "@quantfive/js-web-config";
import API, { buildQueryString, generateApiUrl } from "~/config/api";
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
  vote: "YES" | "NO";
  betAmount?: number;
}): Promise<{
  vote?: PredictionMarketVote;
}> => {
  try {
    const url = generateApiUrl("prediction_market_vote");

    const response = await fetch(
      url,
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
    const query = {
      ...(sort && { ordering: sort.toLowerCase() }),
      prediction_market_id: predictionMarketId,
    };
    const baseFetchUrl = generateApiUrl("prediction_market_vote");
    const url = baseFetchUrl + buildQueryString(query);

    const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
      Helpers.parseJSON(res)
    );

    return {
      votes: response.results.map(parsePredictionMarketVote),
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
    const query = {
      prediction_market_id: predictionMarketId,
      is_user_vote: true,
    };
    const baseFetchUrl = generateApiUrl("prediction_market_vote");
    const url = baseFetchUrl + buildQueryString(query);

    const response = await fetch(url, API.GET_CONFIG()).then((res): any =>
      Helpers.parseJSON(res)
    );

    return {
      votes: response.results.map(parsePredictionMarketVote),
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
    const url = generateApiUrl(`prediction_market_vote/${voteId}/soft_delete`);
    await fetch(url, API.POST_CONFIG()).then(Helpers.checkStatus);

    return;
  } catch (err) {
    captureEvent({
      msg: "Error deleting vote",
      data: { voteId },
    });

    throw Error(err as any);
  }
};
