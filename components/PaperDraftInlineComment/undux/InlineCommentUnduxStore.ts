import { Store, createConnectedStore } from "undux";
import { EditorState } from "draft-js";
import { INLINE_COMMENT_MAP } from "../../PaperDraft/util/PaperDraftTextEditorUtil";

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

export function getInlineCommentsGivenBlockKey({
  blockKey,
  editorState,
}: {
  blockKey: string;
  editorState: EditorState;
}): Array<InlineComment> {
  const result: InlineComment[] = [];
  const curreContent = editorState.getCurrentContent();
  const targetBlock = curreContent.getBlockForKey(blockKey);
  targetBlock.findEntityRanges(
    (character): boolean => {
      const entityKey = character.getEntity();
      if (entityKey !== null) {
        const detectableEntity = curreContent.getEntity(entityKey);
        if (
          detectableEntity != null &&
          detectableEntity.getType() === INLINE_COMMENT_MAP.TYPE_KEY
        ) {
          const { commentThreadID } = curreContent
            .getEntity(entityKey)
            .getData();
          if (commentThreadID != null) {
            result.push({
              blockKey,
              commentThreadID,
              entityKey,
              highlightedText: "",
            });
            return true;
          }
        }
      }
      return false;
    },
    (_start, _end) => {}
  );
  return result.sort((entA, entB) => {
    if (entA.commentThreadID == null) {
      return -1;
    } else if (entB.commentThreadID == null) {
      return 1;
    } else {
      return entA.commentThreadID < entB.commentThreadID ? -1 : 1;
    }
  });
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
