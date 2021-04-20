import {
  draftCssToCustomCss,
  INLINE_COMMENT_MAP,
} from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import {
  CharacterMetadata,
  ContentBlock,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import { nullthrows } from "../../../config/utils/nullchecks";
import { PaperDraftStore } from "../../PaperDraft/undux/PaperDraftUnduxStore";
import { ID } from "../../../config/types/root_types";

function getSelectedBlockFromEditorState(editorState, selectionState = null) {
  return editorState
    .getCurrentContent()
    .getBlockForKey(
      selectionState != null
        ? selectionState
        : editorState.getSelection().getStartKey()
    );
}

function getBlockTypesInSet(block: ContentBlock): Set<any> {
  return block != null ? new Set(block.getType().split(" ")) : new Set();
}

function getModifiedContentState({ blockData, editorState, newBlockTypes }) {
  const currentContentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  let modifiedContentState = Modifier.setBlockData(
    currentContentState,
    selectionState,
    blockData
  );
  return Modifier.setBlockType(
    modifiedContentState,
    selectionState,
    Array.from(newBlockTypes).join(" ")
  );
}

function formatBlockTypes(blockTypes) {
  // we manually add custom unstyled css when there's no regular block style
  if (blockTypes.has("paragraph")) {
    blockTypes.delete("paragraph");
    blockTypes.add(draftCssToCustomCss.unstyled);
  }
  return (blockTypes.has(INLINE_COMMENT_MAP.TYPE_KEY) && blockTypes.size < 2) ||
    (!blockTypes.has(INLINE_COMMENT_MAP.TYPE_KEY) && blockTypes.size === 0)
    ? blockTypes.add(draftCssToCustomCss.unstyled)
    : blockTypes;
}

function handleInlineCommentToggle({ editorState, onInlineCommentPrompt }) {
  /* creating entity below mutates entity directly. Copying ensures we don't get undesired sideeffects */
  const copiedEditorState = EditorState.push(
    editorState,
    editorState.getCurrentContent(),
    "apply-entity"
  );
  const currContentState = copiedEditorState.getCurrentContent();
  const blockKey = copiedEditorState.getSelection().getStartKey();
  currContentState.createEntity(
    INLINE_COMMENT_MAP.TYPE_KEY /* entity type key */,
    "MUTABLE",
    /* entity meta data */
    {
      blockKey,
      commentThreadID: null,
    }
  );
  const entityKey = currContentState.getLastCreatedEntityKey();
  const updatedContentWithNewEnt = Modifier.applyEntity(
    currContentState,
    editorState.getSelection(),
    entityKey
  );
  const updatedEditorStateWithNewEnt = EditorState.set(copiedEditorState, {
    currentContent: updatedContentWithNewEnt,
  });
  onInlineCommentPrompt({ blockKey, entityKey });
  return updatedEditorStateWithNewEnt.getCurrentContent();
}

function handleNonInlineCommentBlockToggle(editorState, toggledStyle) {
  const selectionBlock = getSelectedBlockFromEditorState(editorState);
  const currBlockTypes = getBlockTypesInSet(selectionBlock);
  const currBlockData = selectionBlock.getData();

  /* NOTE: Any new styling should be in custom type for consistency */
  const newBlockTypes = new Set();
  const toggledBlockType = draftCssToCustomCss[toggledStyle] || toggledStyle;
  if (!currBlockTypes.has(toggledBlockType)) {
    newBlockTypes.add(toggledBlockType);
  }

  const formattedBlockTypes = formatBlockTypes(newBlockTypes);
  return getModifiedContentState({
    blockData: currBlockData,
    editorState,
    newBlockTypes: formattedBlockTypes,
  });
}

/* ---------------------- EXPORTS ---------------------- */

type HandleBlockStyleToggleArgs = {
  editorState: EditorState;
  onInlineCommentPrompt: ({
    blockKey,
    entityKey,
  }: {
    blockKey: string;
    entityKey: string;
  }) => void;
  toggledStyle: string;
};

export function handleBlockStyleToggle({
  editorState,
  onInlineCommentPrompt,
  toggledStyle,
}: HandleBlockStyleToggleArgs): EditorState {
  const isInlineCommentChange = toggledStyle === INLINE_COMMENT_MAP.TYPE_KEY;
  const modifiedContentState = isInlineCommentChange
    ? handleInlineCommentToggle({
        editorState,
        onInlineCommentPrompt,
      })
    : handleNonInlineCommentBlockToggle(editorState, toggledStyle);
  return EditorState.push(
    editorState,
    modifiedContentState,
    isInlineCommentChange ? "apply-entity" : "change-block-type"
  );
}

type UpdateInlineThreadIdInEntityArgs = {
  entityKey: string;
  paperDraftStore: PaperDraftStore;
  commentThreadID: ID;
};

export function updateInlineThreadIdInEntity({
  entityKey,
  paperDraftStore,
  commentThreadID,
}: UpdateInlineThreadIdInEntityArgs): void {
  const editorState = nullthrows(
    paperDraftStore.get("editorState"),
    "PaperDraftStore must have editorState in order to mutate it"
  );
  const currContentState = editorState.getCurrentContent();
  // directly mutates the entity
  currContentState.mergeEntityData(entityKey, {
    commentThreadID,
  });
  paperDraftStore.set("shouldSavePaper")(true);
}

type RemoveSavedInlineCommentArgs = {
  commentThreadID: ID;
  paperDraftStore: PaperDraftStore;
};

export function removeSavedInlineComment({
  commentThreadID,
  paperDraftStore,
}: RemoveSavedInlineCommentArgs): void {
  const currEditorState = nullthrows(
    paperDraftStore.get("editorState"),
    "EditorState must have been initialized"
  );
  const currContentState = currEditorState.getCurrentContent();
  const currBlocks = currContentState.getBlocksAsArray();
  let shouldBreakFromLoop: boolean = false,
    targetBlock: ContentBlock | null = null;
  for (const block of currBlocks) {
    block.findEntityRanges(
      (character: CharacterMetadata): boolean => {
        const entityKey = character.getEntity();
        if (entityKey != null) {
          const detectableEntity = currContentState.getEntity(entityKey);
          if (
            detectableEntity != null &&
            detectableEntity.getType() === INLINE_COMMENT_MAP.TYPE_KEY &&
            detectableEntity.getData()["commentThreadID"] === commentThreadID
          ) {
            targetBlock = block;
            shouldBreakFromLoop = true;
            return true; /* returning true triggers callback */
          }
        }
        return false;
      },
      (start: number, end: number): void => {
        const blockKey = nullthrows(
          targetBlock,
          "targetBlock must be defined by here"
        ).getKey();
        const targetSelection = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: start,
          focusOffset: end,
        });
        const contentWithClearedEnt = Modifier.applyEntity(
          currContentState,
          targetSelection,
          null /* entityKey */
        );
        const updatedEditorState = EditorState.set(currEditorState, {
          currentContent: contentWithClearedEnt,
        });
        paperDraftStore.set("editorState")(updatedEditorState);
        paperDraftStore.set("shouldSavePaper")(true);
      }
    );
    if (shouldBreakFromLoop) {
      break;
    }
  }
}

export function getCurrSelectionBlockTypesInSet(
  editorState: EditorState
): Set<any> {
  const block = getSelectedBlockFromEditorState(editorState);
  return getBlockTypesInSet(block);
}

export function formatTextWrapID(id: ID): string {
  return `inline-comment-${id}`;
}
