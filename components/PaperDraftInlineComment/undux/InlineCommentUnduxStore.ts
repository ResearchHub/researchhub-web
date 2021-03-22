import { Store, createConnectedStore } from "undux";

/* TODO: calvinhlee inline-comment current can be in any form. 
   Update this when format is solidified */
export type InlineComment = { index: number };
export type State = {
  inlineComments: Array<InlineComment>;
};
export type InlineCommentStore = Store<State>;
export type UpdateInlineCommentArgs = {
  store: InlineCommentStore;
  updatedInlineComment: InlineComment;
};

const initialState: State = {
  inlineComments: [],
};

export function updateInlineComment({
  store,
  updatedInlineComment,
}: UpdateInlineCommentArgs): Store<State> {
  const { index: targetIndex } = updatedInlineComment;
  const newInlineComments = [...store.get("inlineComments")];
  newInlineComments[targetIndex] = updatedInlineComment;
  store.set("inlineComments")(newInlineComments);
  return store;
}

export default createConnectedStore(initialState);
