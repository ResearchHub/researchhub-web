import { createContext } from "react";
import { PredictionMarketVote } from "./types";

type VoteTreeContext = {
  onRemove: (vote: PredictionMarketVote) => void;
};

export const VoteTreeContext = createContext<VoteTreeContext>({
  onRemove: () => null,
});
