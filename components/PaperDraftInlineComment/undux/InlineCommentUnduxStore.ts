import { Store, createConnectedStore } from "undux";
import { EditorState } from "draft-js";
import { emptyFunction } from "../../PaperDraft/util/PaperDraftUtils";

export type ID = string | number | null;
export type InlineCommentStore = Store<State>;
export type FindTargetInlineCommentArg = {
  blockKey: string;
  commentThreadID: ID;
  entityKey: string;
  store: Store<State>;
};
export type InlineComment = {
  /* NOTE: blockKey & entityKey are newly assigned every render.
     Hence, the only reliable source of truth is commentThreadID */
  blockKey: string;
  commentThreadID: ID;
  entityKey: string;
};
export type State = {
  displayBlockKey: ID /* used to render InlineCommentThreadsDisplayBar */;
  inlineComments: { [blockKey: string]: Array<InlineComment> };
  lastPromptRemovedTime: number | null;
  promptAttr: {
    entityKey: ID;
    highlightedText: string | null;
  } /* used mainly for PaperDraftInlineCommentTextWrap */;
  silencedPromptKeys: Set<ID> /* entityKeys */;
};
export type UpdateInlineCommentArgs = {
  store: InlineCommentStore;
  updatedInlineComment: InlineComment;
};

export const findIndexOfCommentInStore = (
  blockKey: string,
  entityKey: string | null,
  _commentThreadID: ID,
  store: InlineCommentStore
): number => {
  return store
    .get("inlineComments")
    [blockKey].findIndex(
      ({
        blockKey: storedBlockKey,
        entityKey: storedEntityKey,
        commentThreadID: _storedCommentThreadID,
      }: InlineComment): boolean =>
        /* intentional shallow comparison to avoid null-undefined */
        entityKey != null
          ? entityKey == storedEntityKey
          : storedBlockKey == blockKey
    );
};

const initialState: State = {
  displayBlockKey: null,
  inlineComments: {},
  lastPromptRemovedTime: null,
  promptAttr: { entityKey: null, highlightedText: null },
  silencedPromptKeys: new Set(),
};

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
  return targetIndex > -1
    ? store.get("inlineComments")[blockKey][targetIndex]
    : null;
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
  const newInlineComments = { ...store.get("inlineComments") };
  if (targetIndex > -1) {
    newInlineComments[blockKey][targetIndex] = updatedInlineComment;
  } else if (newInlineComments[blockKey] != null) {
    newInlineComments[blockKey].push(updatedInlineComment);
  } else {
    newInlineComments[blockKey] = [updatedInlineComment];
  }
  store.set("inlineComments")(newInlineComments);
  return store;
}

export default createConnectedStore(initialState);
