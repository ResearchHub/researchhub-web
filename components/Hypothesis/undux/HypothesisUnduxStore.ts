import { Store, createConnectedStore } from "undux";
import { ID } from "~/config/types/root_types";

export type HypothesisStore = Store<State>;
export type TargetCitationComment = {
  citationThreadID?: ID;
  citationID: ID;
} | null;
export type State = {
  targetCitationComment: TargetCitationComment;
};

const initialState: State = {
  targetCitationComment: null,
};

export default createConnectedStore(initialState);
