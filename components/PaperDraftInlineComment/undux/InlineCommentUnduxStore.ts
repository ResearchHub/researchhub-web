import { Store, createConnectedStore } from "undux";
import { emptyFunction } from "../../PaperDraft/util/PaperDraftUtils";

export type ID = string | number | null;
export type InlineCommentStore = Store<State>;
export type DeleteInlineCommentArgs = {
  blockKey: string;
  entityKey: string;
  commentThreadID: ID;
  store: InlineCommentStore;
};
export type FindTargetInlineCommentArg = {
  blockKey: string;
  commentThreadID: ID;
  entityKey: string;
  store: Store<State>;
};
export type InlineComment = {
  blockKey: string;
  commentThreadID: ID;
  entityKey: string;
};
export type State = {
  currentPromptKey: ID; // entityKey
  inlineComments: Array<InlineComment>;
  lastPromptRemovedTime: number | null;
  lastSavePaperTime: number | null;
  paperID: ID;
  shouldSavePaper: boolean; // trigger to trigger background save of the paper
  silencedPromptKeys: Set<ID>; // entityKeys
};
export type UpdateInlineCommentArgs = {
  store: InlineCommentStore;
  updatedInlineComment: InlineComment;
};

const findIndexOfCommentInStore = (
  blockKey: string,
  entityKey: string | null,
  commentThreadID: ID,
  store: InlineCommentStore
): number => {
  return store
    .get("inlineComments")
    .findIndex(
      ({
        blockKey: storedBlockKey,
        entityKey: storedEntityKey,
        commentThreadID: storedCommentThreadID,
      }: InlineComment): boolean => {
        /* intentional shallow comparison to avoid null-undefined */
        if (entityKey != null) {
          return (
            storedBlockKey == blockKey &&
            entityKey == storedEntityKey &&
            storedCommentThreadID == commentThreadID
          );
        } else {
          return (
            storedBlockKey == blockKey &&
            storedCommentThreadID == commentThreadID
          );
        }
      }
    );
};

const initialState: State = {
  currentPromptKey: null,
  inlineComments: [],
  lastPromptRemovedTime: null,
  lastSavePaperTime: null,
  shouldSavePaper: false,
  silencedPromptKeys: new Set(),
  paperID: null,
};

export function deleteInlineComment({
  blockKey,
  entityKey,
  commentThreadID,
  store,
}: DeleteInlineCommentArgs): InlineCommentStore {
  const targetIndex = findIndexOfCommentInStore(
    blockKey,
    entityKey,
    commentThreadID,
    store
  );
  try {
    if (targetIndex > -1) {
      const newInlineComments = [...store.get("inlineComments")];
      newInlineComments.splice(targetIndex, 1);
      store.set("inlineComments")(newInlineComments);
    } else {
      throw new Error(
        `trying to delete non-existing comment: blockKey-${blockKey}, commentThreadID-${commentThreadID}`
      );
    }
  } catch (error) {
    emptyFunction(error.toString());
  }
  return store;
}

export function findTargetInlineComment({
  blockKey,
  commentThreadID,
  entityKey,
  store,
}: FindTargetInlineCommentArg): InlineComment | null {
  const targetIndex = findIndexOfCommentInStore(
    blockKey,
    entityKey,
    commentThreadID,
    store
  );
  return targetIndex > -1 ? store.get("inlineComments")[targetIndex] : null;
}

export function updateInlineComment({
  store,
  updatedInlineComment,
}: UpdateInlineCommentArgs): InlineCommentStore {
  const { blockKey, commentThreadID, entityKey } = updatedInlineComment;
  const targetIndex = findIndexOfCommentInStore(
    blockKey,
    entityKey,
    commentThreadID,
    store
  );
  const newInlineComments = [...store.get("inlineComments")];
  if (targetIndex > -1) {
    newInlineComments[targetIndex] = updatedInlineComment;
  } else {
    newInlineComments.push(updatedInlineComment);
  }
  store.set("inlineComments")(newInlineComments);
  return store;
}

export default createConnectedStore(initialState);
