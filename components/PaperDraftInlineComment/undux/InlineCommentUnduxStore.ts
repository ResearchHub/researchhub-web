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
export type InlineComment = {
  blockKey: string;
  entityKey: string;
  commentThreadID: ID;
};
export type GroupedInlineComments = {
  [blockKey: string]: Array<InlineComment>;
};
export type State = {
  // inlineComments are grouped by blockKey to encourage threads to be recognized as relevant @ UI / UX level
  inlineComments: GroupedInlineComments;
  paperID: ID;
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
  return (store.get("inlineComments")[blockKey] || []).findIndex(
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
          storedBlockKey == blockKey && storedCommentThreadID == commentThreadID
        );
      }
    }
  );
};

const initialState: State = { paperID: null, inlineComments: {} };

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
      const newInlineComments = { ...store.get("inlineComments") };
      newInlineComments[blockKey].splice(targetIndex, 1);
      if (newInlineComments[blockKey].length === 0) {
        delete newInlineComments[blockKey];
      }
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

export function updateInlineComment({
  store,
  updatedInlineComment,
}: UpdateInlineCommentArgs): InlineCommentStore {
  const { blockKey, entityKey, commentThreadID } = updatedInlineComment;
  const targetIndex = findIndexOfCommentInStore(
    blockKey,
    entityKey,
    commentThreadID,
    store
  );
  console.warn("targetIndex: ", targetIndex);
  const newInlineComments = { ...store.get("inlineComments") };
  console.warn("curr inline comments: ", newInlineComments);
  if (targetIndex > -1) {
    newInlineComments[blockKey][targetIndex] = updatedInlineComment;
  } else {
    /* if index doesn't exist, we are creating an exntirely new comment thread given a block */
    console.warn("YO: ", updatedInlineComment);
    const targetArr = newInlineComments[blockKey];
    if (targetArr != null) {
      targetArr.push(updatedInlineComment);
    } else {
      newInlineComments[blockKey] = [updatedInlineComment];
    }
  }
  store.set("inlineComments")(newInlineComments);
  return store;
}

export default createConnectedStore(initialState);
