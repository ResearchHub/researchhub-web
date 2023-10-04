import { ID, RHUser, parseUser } from "~/config/types/root_types";
import { formatDateStandard, timeSince } from "~/config/utils/dates";

export type PredictionMarketDetails = {
  id: ID;
  votes: {
    total: number;
    yes: number;
    no: number;
  };
  status: "OPEN" | "CLOSED" | "RESOLVED";
  predictionType: "REPLICATION_PREDICTION";
};

export const EmptyPredictionMarketDetails: PredictionMarketDetails = {
  id: "",
  votes: {
    total: 0,
    yes: 0,
    no: 0,
  },
  status: "OPEN",
  predictionType: "REPLICATION_PREDICTION",
};

export const parsePredictionMarketDetails = (
  raw: any
): PredictionMarketDetails => ({
  id: raw.id,
  votes: {
    total: raw.votes.total,
    yes: raw.votes.yes,
    no: raw.votes.no,
  },
  status: raw.status,
  predictionType: raw.prediction_type,
});

export type PredictionMarketVote = {
  id: ID;

  predictionMarketId: ID;

  vote: boolean;
  betAmount?: number;

  createdDate?: string;
  updatedDate?: string;
  timeAgo?: string;

  createdBy: RHUser;
};

export const parsePredictionMarketVote = (raw: any): PredictionMarketVote => {
  let betAmount = raw.bet_amount ? parseFloat(raw.bet_amount) : 0;
  if (betAmount && isNaN(betAmount)) {
    betAmount = 0;
  }

  const res = {
    id: raw.id,

    predictionMarketId: raw.prediction_market,

    vote: raw.vote,
    betAmount,

    createdDate: formatDateStandard(raw.created_date),
    updatedDate: formatDateStandard(raw.updated_date),
    timeAgo: timeSince(raw.created_date),

    createdBy: parseUser(raw.created_by),
  };
  return res;
};
