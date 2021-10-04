import { Store, createConnectedStore } from "undux";
import { ID } from "~/config/types/root_types";

export type TargetCitationComment = {
  citationThreadID?: ID;
  citationID: ID;
} | null;
export type State = {
  targetCitationComment: TargetCitationComment;
};
export type HypothesisStore = Store<State>;

const initialState: State = {
  targetCitationComment: { citationID: 1 },
};

export default createConnectedStore(initialState);
