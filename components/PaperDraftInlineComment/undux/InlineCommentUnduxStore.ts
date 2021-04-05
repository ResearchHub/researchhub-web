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
  highlightedText: string;
};
export type State = {
  displayableInlineComments: Array<
    InlineComment
  > /* used to render InlineCommentThreadsDisplayBar */;
  inlineComments: Array<InlineComment>;
  lastPromptRemovedTime: number | null;
  paperID: ID;
  promptedEntityKey: ID /* used mainly for PaperDraftInlineCommentTextWrap */;
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
    .findIndex(
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
  displayableInlineComments: [],
  inlineComments: [],
  lastPromptRemovedTime: null,
  paperID: null,
  promptedEntityKey: null,
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
