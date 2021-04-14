import {
  draftCssToCustomCss,
  INLINE_COMMENT_MAP,
} from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import { EditorState, Modifier } from "draft-js";

function getSelectedBlockFromEditorState(editorState, selectionState = null) {
  return editorState
    .getCurrentContent()
    .getBlockForKey(
      selectionState != null
        ? selectionState
        : editorState.getSelection().getStartKey()
    );
}

function getBlockTypesInSet(block) {
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

/* NOTE: This function only upserts. 
   Deletion must be done at the Comment-UI, utilizing a direct backend-call & updating unduxStore */
function handleInlineCommentBlockToggle({
  editorState,
  onInlineCommentPrompt,
}) {
  /* ---- Applying Entity to Draft---- */
  const blockKey = editorState.getSelection().getStartKey();
  const currContentState = editorState.getCurrentContent();
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
  const updatedEditorStateWithNewEnt = EditorState.set(editorState, {
    currentContent: updatedContentWithNewEnt,
  });
  onInlineCommentPrompt(entityKey);
  return updatedEditorStateWithNewEnt.getCurrentContent();
}

function handleNonInlineCommentBlockToggle(editorState, toggledStyle) {
  const selectionBlock = getSelectedBlockFromEditorState(editorState);
  const currBlockTypes = getBlockTypesInSet(selectionBlock);
  const currBlockData = selectionBlock.getData();

  /* NOTE: Any new styling should be in custom type for consistency */
  const newBlockTypes = new Set();
  const toggledBlockType = draftCssToCustomCss[toggledStyle] ?? toggledStyle;
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

/* -------- EXPORTS -------- */
export function handleBlockStyleToggle({
  editorState,
  onInlineCommentPrompt,
  toggledStyle,
}) {
  const modifiedContentState =
    toggledStyle === INLINE_COMMENT_MAP.TYPE_KEY
      ? handleInlineCommentBlockToggle({
          editorState,
          onInlineCommentPrompt,
        })
      : handleNonInlineCommentBlockToggle(editorState, toggledStyle);
  return EditorState.push(editorState, modifiedContentState);
}

export function updateInlineThreadIdInEntity({
  entityKey,
  paperDraftStore,
  commentThreadID,
}) {
  const editorState = paperDraftStore.get("editorState");
  const currContentState = editorState.getCurrentContent();
  // directly mutates the entity
  currContentState.mergeEntityData(entityKey, {
    commentThreadID,
  });
  paperDraftStore.set("shouldSavePaper")(true);
}

export function getCurrSelectionBlockTypesInSet(editorState) {
  const block = getSelectedBlockFromEditorState(editorState);
  return getBlockTypesInSet(block);
}

export function formatTextWrapID(id) {
  return `inline-comment-${id}`;
}
