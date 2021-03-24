import { Store, createConnectedStore } from "undux";

export type InlineCommentStore = Store<State>;
export type DeleteInlineCommentArgs = {
  blockKey: string;
  store: InlineCommentStore;
};
export type InlineComment = {
  blockKey: string;
  commentThreadID: number | string;
};
export type State = {
  paperID: number | null;
  inlineComments: { [blockKey: string]: InlineComment };
};
export type UpdateInlineCommentArgs = {
  store: InlineCommentStore;
  updatedInlineComment: InlineComment;
};

const initialState: State = { paperID: null, inlineComments: {} };

export function deleteInlineComment({
  blockKey,
  store,
}: DeleteInlineCommentArgs): InlineCommentStore {
  const newInlineComments = { ...store.get("inlineComments") };
  delete newInlineComments[blockKey];
  store.set("inlineComments")(newInlineComments);
  return store;
}

export function updateInlineComment({
  store,
  updatedInlineComment,
}: UpdateInlineCommentArgs): InlineCommentStore {
  const { blockKey } = updatedInlineComment;
  const newInlineComments = { ...store.get("inlineComments") };
  newInlineComments[blockKey] = updatedInlineComment;
  store.set("inlineComments")(newInlineComments);
  return store;
}

export default createConnectedStore(initialState);
