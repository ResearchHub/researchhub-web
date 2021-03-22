import { createConnectedStore } from "undux";

export type State = {
  // TODO: calvinhlee inline-comment current can be in any form. Update this when format is solidified
  inlineComments: Array<any>;
};

const initialState: State = {
  inlineComments: [],
};

export default createConnectedStore(initialState);
