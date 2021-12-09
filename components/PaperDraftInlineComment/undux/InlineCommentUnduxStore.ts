import { Store, createConnectedStore } from "undux";
import { EditorState } from "draft-js";
import { INLINE_COMMENT_MAP } from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import { ID } from "../../../config/types/root_types";

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
  highlightedText: string | null;
};
export type PreparingInlineComment = {
  blockKey?: string | null;
  entityKey?: string | null;
  highlightedText?: string | null;
  offsetTop?: number | null;
};
export type State = {
  displayableInlineComments: Array<
    InlineComment
  > /* used to render InlineCommentThreadsDisplayBar */;
  lastPromptRemovedTime: number | null;
  paperID: ID;
  preparingInlineComment: PreparingInlineComment /* used PaperDraftInlineCommentTextWrap */;
  promptedEntityKey: string | null;
  silencedPromptKeys: Set<ID> /* entityKeys */;
};
export type UpdateInlineCommentArgs = {
  store: InlineCommentStore;
  updatedInlineComment: InlineComment;
};

const initialState: State = {
  displayableInlineComments: [],
  lastPromptRemovedTime: null,
  paperID: null,
  promptedEntityKey: null,
  preparingInlineComment: {},
  silencedPromptKeys: new Set(),
};

export function getSavedInlineCommentsGivenBlockKey({
  blockKey,
  editorState,
}: {
  blockKey: string;
  editorState: EditorState;
}): Array<InlineComment> {
  const result: InlineComment[] = [];
  const currContent = editorState.getCurrentContent();
  const targetBlock = currContent.getBlockForKey(blockKey);
  targetBlock.findEntityRanges(
    (character): boolean => {
      const entityKey = character.getEntity();
      if (entityKey !== null) {
        const detectableEntity = currContent.getEntity(entityKey);
        if (
          detectableEntity != null &&
          detectableEntity.getType() === INLINE_COMMENT_MAP.TYPE_KEY
        ) {
          const { commentThreadID } = currContent
            .getEntity(entityKey)
            .getData();
          if (commentThreadID != null) {
            result.push({
              blockKey,
              commentThreadID,
              entityKey,
              highlightedText: null,
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
    return (entA.commentThreadID || 0) < (entB.commentThreadID || 0) ? -1 : 1;
  });
}

/* If the comment is saved in the backend, the reliable source is commentThreadID from entity */
export function getSavedInlineCommentsGivenBlockKeyAndThreadID({
  blockKey,
  commentThreadID,
  editorState,
}: {
  blockKey: string;
  commentThreadID: ID;
  editorState: EditorState | null;
}): Array<InlineComment> {
  const result: InlineComment[] = [];
  if (editorState === null) {
    return result;
  }
  const currContent = editorState.getCurrentContent();
  const targetBlock = currContent.getBlockForKey(blockKey);
  targetBlock.findEntityRanges(
    (character): boolean => {
      const entityKey = character.getEntity();
      if (entityKey !== null) {
        const detectableEntity = currContent.getEntity(entityKey);
        if (
          detectableEntity != null &&
          detectableEntity.getType() === INLINE_COMMENT_MAP.TYPE_KEY
        ) {
          const {
            commentThreadID: entityCommentThreadID,
          } = detectableEntity.getData();
          if (entityCommentThreadID === commentThreadID) {
            result.push({
              blockKey,
              commentThreadID,
              entityKey,
              highlightedText: null,
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
    return (entA.commentThreadID || 0) < (entB.commentThreadID || 0) ? -1 : 1;
  });
}

/* hides comments without commentThreadID */
export function cleanupStoreAndCloseDisplay({
  inlineCommentStore,
}: {
  inlineCommentStore: InlineCommentStore;
  exceptionEntityKey?: ID;
}): void {
  inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
  inlineCommentStore.set("displayableInlineComments")([]);
  inlineCommentStore.set("preparingInlineComment")({});
  inlineCommentStore.set("promptedEntityKey")(null);
}

export default createConnectedStore(initialState);
