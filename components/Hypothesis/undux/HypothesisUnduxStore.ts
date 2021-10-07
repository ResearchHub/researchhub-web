import { Store, createConnectedStore } from "undux";
import { ID } from "~/config/types/root_types";

export type TargetCitationComment = {
  citationID: ID;
  citationThreadID?: ID;
  citationTitle: string;
  citationUnidocID: ID;
} | null;
export type State = {
  targetCitationComment: TargetCitationComment;
};
export type HypothesisStore = Store<State>;

const initialState: State = {
  targetCitationComment: null,
};

export default createConnectedStore(initialState);
